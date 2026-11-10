import type { Cliente, Configuracoes, ItemPedido, Pedido } from '../types'
import { brl, soDigitos } from './formato'

export const totalItens = (itens: ItemPedido[]) =>
  Math.round(itens.reduce((s, i) => s + i.preco * i.quantidade, 0) * 100) / 100

export const quantidadeItens = (itens: { quantidade: number }[]) =>
  itens.reduce((s, i) => s + i.quantidade, 0)

/**
 * Texto enviado ao WhatsApp da loja. Só dados que o próprio cliente digitou;
 * valores saem marcados como ilustrativos para não parecerem preço fechado.
 */
export function montarMensagem(pedido: Pedido, config: Configuracoes): string {
  const l: string[] = []
  l.push(config.saudacaoWhatsapp)
  l.push('')
  l.push(`*Solicitação nº ${pedido.numero}*`)
  l.push(`Nome: ${pedido.clienteNome}`)
  l.push(`Perfil: ${pedido.perfil === 'pj' ? 'Empresa/comerciante' : 'Pessoa física'}`)
  l.push(`Atendimento: ${pedido.atendimento === 'atacado' ? 'Atacado (orçamento em quantidade)' : 'Varejo'}`)
  if (pedido.entrega === 'entrega') {
    l.push(`Recebimento: Entrega${pedido.bairro ? ` — bairro ${pedido.bairro}` : ''}`)
    if (pedido.endereco) l.push(`Endereço: ${pedido.endereco}`)
  } else {
    l.push('Recebimento: Retirada na loja')
  }
  l.push('')
  l.push('*Itens:*')
  for (const i of pedido.itens) {
    l.push(`• ${i.quantidade}× ${i.nome} (${i.unidade}) — ${brl(i.preco * i.quantidade)}`)
  }
  l.push('')
  l.push(`Subtotal estimado: ${brl(totalItens(pedido.itens))}`)
  l.push('_Valores ilustrativos. Aguardo confirmação de preços, disponibilidade' +
    (pedido.entrega === 'entrega' ? ' e entrega._' : '._'))
  if (pedido.observacoes) {
    l.push('')
    l.push(`Observações: ${pedido.observacoes}`)
  }
  return l.join('\n')
}

export function linkWhatsapp(numero: string, mensagem?: string): string {
  const d = soDigitos(numero)
  const comPais = d.startsWith('55') ? d : `55${d}`
  return `https://wa.me/${comPais}${mensagem ? `?text=${encodeURIComponent(mensagem)}` : ''}`
}

export interface Indicadores {
  total: number
  novos: number
  emAtendimento: number
  confirmados: number
  finalizados: number
  cancelados: number
  atacado: number
  clientesRecorrentes: number
}

/** Pedidos válidos de um cliente (cancelados não contam como compra). */
export const pedidosDoCliente = (pedidos: Pedido[], clienteId: string) =>
  pedidos
    .filter((p) => p.clienteId === clienteId)
    .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))

export function calcularIndicadores(pedidos: Pedido[], clientes: Cliente[]): Indicadores {
  const conta = (s: Pedido['status']) => pedidos.filter((p) => p.status === s).length
  const recorrentes = clientes.filter(
    (c) => pedidos.filter((p) => p.clienteId === c.id && p.status !== 'cancelado').length >= 2,
  ).length
  return {
    total: pedidos.length,
    novos: conta('novo'),
    emAtendimento: conta('em_atendimento'),
    confirmados: conta('confirmado'),
    finalizados: conta('finalizado'),
    cancelados: conta('cancelado'),
    atacado: pedidos.filter((p) => p.atendimento === 'atacado').length,
    clientesRecorrentes: recorrentes,
  }
}

/** Intervalo médio, em dias, entre os pedidos de um cliente; null se houver menos de dois. */
export function frequenciaDias(pedidos: Pedido[]): number | null {
  const datas = pedidos
    .filter((p) => p.status !== 'cancelado')
    .map((p) => new Date(p.criadoEm).getTime())
    .sort((a, b) => a - b)
  if (datas.length < 2) return null
  return Math.max(1, Math.round((datas[datas.length - 1] - datas[0]) / (datas.length - 1) / 86_400_000))
}
