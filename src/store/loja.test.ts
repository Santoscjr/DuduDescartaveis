import { describe, expect, it } from 'vitest'
import { Loja } from './loja'
import type { Repositorio } from './repositorio'
import { criarBancoInicial } from '../data/seed'
import type { Banco } from '../types'
import { calcularIndicadores, frequenciaDias, linkWhatsapp, montarMensagem, pedidosDoCliente } from '../lib/pedidos'
import { normalizar } from '../lib/formato'

function lojaEmMemoria() {
  let salvo: Banco | null = null
  const repo: Repositorio = {
    carregar: () => (salvo ? structuredClone(salvo) : criarBancoInicial(new Date('2026-11-10T12:00:00Z'))),
    salvar: (b) => { salvo = structuredClone(b) },
    observar: () => () => {},
  }
  return { loja: new Loja(repo), repo, salvo: () => salvo }
}

const base = { nome: 'Maria Teste', perfil: 'pf', atendimento: 'varejo', entrega: 'retirada', origem: 'site' } as const

describe('dados iniciais', () => {
  it('tem catálogo coerente', () => {
    const b = criarBancoInicial()
    expect(b.produtos.length).toBeGreaterThanOrEqual(30)
    const cats = new Set(b.categorias.map((c) => c.id))
    expect(b.produtos.every((p) => cats.has(p.categoriaId) && p.preco > 0)).toBe(true)
    expect(new Set(b.produtos.map((p) => p.id)).size).toBe(b.produtos.length)
    for (const c of b.categorias) expect(b.produtos.some((p) => p.categoriaId === c.id)).toBe(true)
  })
  it('usa apenas telefones fictícios para clientes', () => {
    expect(criarBancoInicial().clientes.every((c) => !c.telefone || c.telefone.includes('90000-'))).toBe(true)
  })
})

describe('carrinho', () => {
  it('adiciona, altera e remove', () => {
    const { loja } = lojaEmMemoria()
    loja.adicionar('copo-200', 2)
    loja.adicionar('copo-200')
    loja.adicionar('agua-500')
    expect(loja.estado().carrinho).toEqual([{ produtoId: 'copo-200', quantidade: 3 }, { produtoId: 'agua-500', quantidade: 1 }])
    loja.definirQuantidade('copo-200', 10)
    loja.definirQuantidade('agua-500', 0)
    expect(loja.estado().carrinho).toEqual([{ produtoId: 'copo-200', quantidade: 10 }])
    loja.definirQuantidade('copo-200', -5)
    expect(loja.estado().carrinho).toEqual([])
  })
})

describe('solicitações', () => {
  it('registra o pedido, esvazia o carrinho e persiste', () => {
    const { loja, salvo } = lojaEmMemoria()
    const antes = loja.estado().pedidos.length
    loja.adicionar('copo-200', 2)
    loja.adicionar('carvao-3', 1)
    const p = loja.criarSolicitacao({ ...base, entrega: 'entrega', bairro: ' Centro ' })!
    expect(p.status).toBe('novo')
    expect(p.numero).toBe(1014)
    expect(p.bairro).toBe('Centro')
    expect(p.itens).toHaveLength(2)
    expect(loja.estado().carrinho).toEqual([])
    expect(loja.estado().meusPedidos).toContain(p.id)
    expect(salvo()!.pedidos).toHaveLength(antes + 1)
  })
  it('não registra sem itens ou sem nome', () => {
    const { loja } = lojaEmMemoria()
    expect(loja.criarSolicitacao(base)).toBeNull()
    loja.adicionar('copo-200')
    expect(loja.criarSolicitacao({ ...base, nome: '  ' })).toBeNull()
  })
  it('descarta endereço quando é retirada', () => {
    const { loja } = lojaEmMemoria()
    loja.adicionar('copo-200')
    const p = loja.criarSolicitacao({ ...base, bairro: 'Centro', endereco: 'Rua X' })!
    expect(p.bairro).toBeUndefined()
    expect(p.endereco).toBeUndefined()
  })
  it('reaproveita o cliente pelo nome e cria um novo quando não existe', () => {
    const { loja } = lojaEmMemoria()
    const n = loja.estado().clientes.length
    loja.adicionar('copo-200')
    loja.criarSolicitacao(base)
    loja.adicionar('copo-200')
    loja.criarSolicitacao({ ...base, nome: 'maria teste' })
    expect(loja.estado().clientes).toHaveLength(n + 1)
  })
  it('altera status', () => {
    const { loja } = lojaEmMemoria()
    loja.alterarStatus('p1013', 'confirmado')
    expect(loja.estado().pedidos.find((p) => p.id === 'p1013')!.status).toBe('confirmado')
  })
  it('usa o preço vigente no momento da solicitação', () => {
    const { loja } = lojaEmMemoria()
    const copo = loja.estado().produtos.find((p) => p.id === 'copo-200')!
    loja.salvarProduto({ ...copo, preco: 7.5 })
    loja.adicionar('copo-200', 2)
    const p = loja.criarSolicitacao(base)!
    expect(p.itens[0].preco).toBe(7.5)
    loja.salvarProduto({ ...copo, preco: 99 })
    expect(loja.estado().pedidos.find((x) => x.id === p.id)!.itens[0].preco).toBe(7.5)
  })
})

describe('recompra', () => {
  it('repete um pedido ignorando produtos desativados', () => {
    const { loja } = lojaEmMemoria()
    const marmita = loja.estado().produtos.find((p) => p.id === 'marmita-8')!
    loja.salvarProduto({ ...marmita, ativo: false })
    const r = loja.repetirPedido('p1012')
    expect(r).toEqual({ adicionados: 4, indisponiveis: 1 })
    expect(loja.estado().carrinho.some((i) => i.produtoId === 'marmita-8')).toBe(false)
  })
})

describe('produtos e categorias', () => {
  it('cadastra, edita e exclui produto', () => {
    const { loja } = lojaEmMemoria()
    const novo = loja.salvarProduto({ nome: 'Novo', categoriaId: 'copos', descricao: '', unidade: 'un.', preco: 1, arte: 'copo', cor: '#000', destaque: false, ativo: true })
    expect(loja.estado().produtos.some((p) => p.id === novo.id)).toBe(true)
    loja.adicionar(novo.id)
    loja.excluirProduto(novo.id)
    expect(loja.estado().produtos.some((p) => p.id === novo.id)).toBe(false)
    expect(loja.estado().carrinho).toEqual([])
  })
  it('reordena categorias e só exclui as vazias', () => {
    const { loja } = lojaEmMemoria()
    loja.moverCategoria('pratos', -1)
    const ord = [...loja.estado().categorias].sort((a, b) => a.ordem - b.ordem).map((c) => c.id)
    expect(ord.slice(0, 2)).toEqual(['pratos', 'copos'])
    expect(loja.excluirCategoria('copos')).toBe(false)
    loja.salvarCategoria({ nome: 'Festas', descricao: '', arte: 'copo', ativo: true })
    const nova = loja.estado().categorias.find((c) => c.nome === 'Festas')!
    expect(nova.ordem).toBe(10)
    expect(loja.excluirCategoria(nova.id)).toBe(true)
  })
})

describe('indicadores e mensagem', () => {
  const b = criarBancoInicial(new Date('2026-11-10T12:00:00Z'))
  it('deriva indicadores dos pedidos', () => {
    const i = calcularIndicadores(b.pedidos, b.clientes)
    expect(i.total).toBe(13)
    expect(i.novos).toBe(2)
    expect(i.emAtendimento).toBe(1)
    expect(i.confirmados).toBe(1)
    expect(i.finalizados).toBe(8)
    expect(i.cancelados).toBe(1)
    expect(i.novos + i.emAtendimento + i.confirmados + i.finalizados + i.cancelados).toBe(i.total)
    expect(i.clientesRecorrentes).toBe(4)
  })
  it('calcula a frequência de compra', () => {
    expect(frequenciaDias(pedidosDoCliente(b.pedidos, 'c1'))).toBe(14)
    expect(frequenciaDias(pedidosDoCliente(b.pedidos, 'c5'))).toBeNull()
  })
  it('monta mensagem e link do WhatsApp', () => {
    const p = { ...b.pedidos[12], observacoes: 'Troco para 100' }
    const m = montarMensagem(p, b.config)
    expect(m).toContain('Solicitação nº 1013')
    expect(m).toContain('2× Galão de água mineral 20 L')
    expect(m).toContain('Retirada na loja')
    expect(m).toContain('Valores ilustrativos')
    expect(m).toContain('Troco para 100')
    const link = linkWhatsapp(b.config.whatsapp, 'Olá & tudo')
    expect(link).toBe('https://wa.me/5521973501352?text=Ol%C3%A1%20%26%20tudo')
  })
  it('normaliza busca sem acento', () => {
    expect(normalizar('  ÁGUA Mineral ')).toBe('agua mineral')
  })
})
