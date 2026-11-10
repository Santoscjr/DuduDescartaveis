import type {
  Banco, Categoria, Cliente, Configuracoes, Entrega, Atendimento, Origem, Pedido, Perfil, Produto, Status,
} from '../types'
import { criarBancoInicial } from '../data/seed'
import { normalizar } from '../lib/formato'
import type { Repositorio } from './repositorio'

export interface NovaSolicitacao {
  nome: string
  perfil: Perfil
  atendimento: Atendimento
  entrega: Entrega
  bairro?: string
  endereco?: string
  observacoes?: string
  origem: Origem
}

const novoId = (prefixo: string) => `${prefixo}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

/**
 * Estado único da demonstração, compartilhado pelo site e pelo painel.
 * Toda alteração passa por aqui e é gravada no repositório.
 */
export class Loja {
  private banco: Banco
  private ouvintes = new Set<() => void>()

  constructor(private repo: Repositorio) {
    this.banco = repo.carregar()
    repo.observar(() => {
      this.banco = repo.carregar()
      this.ouvintes.forEach((f) => f())
    })
  }

  assinar = (f: () => void) => {
    this.ouvintes.add(f)
    return () => this.ouvintes.delete(f)
  }

  estado = () => this.banco

  private alterar(mudanca: (b: Banco) => Banco) {
    this.banco = mudanca(this.banco)
    this.repo.salvar(this.banco)
    this.ouvintes.forEach((f) => f())
  }

  // ---- Carrinho (lista de pedido do cliente) ----

  definirQuantidade(produtoId: string, quantidade: number) {
    const q = Math.max(0, Math.min(9999, Math.floor(quantidade) || 0))
    this.alterar((b) => {
      const resto = b.carrinho.filter((i) => i.produtoId !== produtoId)
      const existia = b.carrinho.some((i) => i.produtoId === produtoId)
      if (q === 0) return { ...b, carrinho: resto }
      return {
        ...b,
        carrinho: existia
          ? b.carrinho.map((i) => (i.produtoId === produtoId ? { ...i, quantidade: q } : i))
          : [...b.carrinho, { produtoId, quantidade: q }],
      }
    })
  }

  adicionar(produtoId: string, quantidade = 1) {
    const atual = this.banco.carrinho.find((i) => i.produtoId === produtoId)?.quantidade ?? 0
    this.definirQuantidade(produtoId, atual + quantidade)
  }

  limparCarrinho() {
    this.alterar((b) => ({ ...b, carrinho: [] }))
  }

  /** Recompra: coloca no carrinho os itens de um pedido anterior que ainda estão ativos no catálogo. */
  repetirPedido(pedidoId: string): { adicionados: number; indisponiveis: number } {
    const pedido = this.banco.pedidos.find((p) => p.id === pedidoId)
    if (!pedido) return { adicionados: 0, indisponiveis: 0 }
    const ativos = new Set(this.banco.produtos.filter((p) => p.ativo).map((p) => p.id))
    const validos = pedido.itens.filter((i) => ativos.has(i.produtoId))
    this.alterar((b) => ({
      ...b,
      carrinho: validos.map((i) => ({ produtoId: i.produtoId, quantidade: i.quantidade })),
    }))
    return { adicionados: validos.length, indisponiveis: pedido.itens.length - validos.length }
  }

  // ---- Solicitações ----

  /** Transforma o carrinho em uma solicitação registrada. Retorna null se não houver itens válidos. */
  criarSolicitacao(dados: NovaSolicitacao, clienteId?: string): Pedido | null {
    const b = this.banco
    const itens = b.carrinho.flatMap((i) => {
      const p = b.produtos.find((x) => x.id === i.produtoId && x.ativo)
      return p ? [{ produtoId: p.id, nome: p.nome, unidade: p.unidade, preco: p.preco, quantidade: i.quantidade }] : []
    })
    const nome = dados.nome.trim()
    if (!itens.length || !nome) return null

    // Sem cadastro: o cliente é reconhecido pelo nome informado, só para agrupar o histórico na demonstração.
    let cliente = clienteId
      ? b.clientes.find((c) => c.id === clienteId)
      : b.clientes.find((c) => normalizar(c.nome) === normalizar(nome) && c.perfil === dados.perfil)
    const clientes = [...b.clientes]
    if (!cliente) {
      cliente = { id: novoId('c'), nome, perfil: dados.perfil, bairro: dados.bairro?.trim() || undefined }
      clientes.push(cliente)
    }

    const numero = Math.max(1000, ...b.pedidos.map((p) => p.numero)) + 1
    const pedido: Pedido = {
      id: novoId('p'),
      numero,
      criadoEm: new Date().toISOString(),
      clienteId: cliente.id,
      clienteNome: cliente.nome,
      perfil: dados.perfil,
      atendimento: dados.atendimento,
      entrega: dados.entrega,
      bairro: dados.entrega === 'entrega' ? dados.bairro?.trim() || undefined : undefined,
      endereco: dados.entrega === 'entrega' ? dados.endereco?.trim() || undefined : undefined,
      observacoes: dados.observacoes?.trim() || undefined,
      origem: dados.origem,
      status: 'novo',
      itens,
    }
    this.alterar((x) => ({
      ...x,
      clientes,
      pedidos: [...x.pedidos, pedido],
      carrinho: [],
      meusPedidos: [...x.meusPedidos, pedido.id],
    }))
    return pedido
  }

  alterarStatus(pedidoId: string, status: Status) {
    this.alterar((b) => ({ ...b, pedidos: b.pedidos.map((p) => (p.id === pedidoId ? { ...p, status } : p)) }))
  }

  // ---- Produtos ----

  salvarProduto(dados: Omit<Produto, 'id'> & { id?: string }): Produto {
    const produto: Produto = { ...dados, id: dados.id ?? novoId('prod') }
    this.alterar((b) => ({
      ...b,
      produtos: b.produtos.some((p) => p.id === produto.id)
        ? b.produtos.map((p) => (p.id === produto.id ? produto : p))
        : [...b.produtos, produto],
    }))
    return produto
  }

  excluirProduto(id: string) {
    this.alterar((b) => ({
      ...b,
      produtos: b.produtos.filter((p) => p.id !== id),
      carrinho: b.carrinho.filter((i) => i.produtoId !== id),
    }))
  }

  // ---- Categorias ----

  salvarCategoria(dados: Omit<Categoria, 'id' | 'ordem'> & { id?: string }) {
    this.alterar((b) => {
      if (dados.id) {
        return { ...b, categorias: b.categorias.map((c) => (c.id === dados.id ? { ...c, ...dados, id: c.id } : c)) }
      }
      const ordem = Math.max(0, ...b.categorias.map((c) => c.ordem)) + 1
      return { ...b, categorias: [...b.categorias, { ...dados, id: novoId('cat'), ordem }] }
    })
  }

  moverCategoria(id: string, direcao: -1 | 1) {
    this.alterar((b) => {
      const ord = [...b.categorias].sort((a, c) => a.ordem - c.ordem)
      const i = ord.findIndex((c) => c.id === id)
      const j = i + direcao
      if (i < 0 || j < 0 || j >= ord.length) return b
      ;[ord[i], ord[j]] = [ord[j], ord[i]]
      return { ...b, categorias: ord.map((c, k) => ({ ...c, ordem: k + 1 })) }
    })
  }

  /** Só exclui categoria vazia; com produtos, o caminho é desativar. */
  excluirCategoria(id: string): boolean {
    if (this.banco.produtos.some((p) => p.categoriaId === id)) return false
    this.alterar((b) => ({ ...b, categorias: b.categorias.filter((c) => c.id !== id) }))
    return true
  }

  // ---- Clientes e configurações ----

  salvarCliente(cliente: Cliente) {
    this.alterar((b) => ({ ...b, clientes: b.clientes.map((c) => (c.id === cliente.id ? cliente : c)) }))
  }

  salvarConfig(config: Configuracoes) {
    this.alterar((b) => ({ ...b, config }))
  }

  restaurarDemonstracao() {
    this.alterar(() => criarBancoInicial())
  }
}
