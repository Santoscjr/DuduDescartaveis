const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const brl = (v: number) => moeda.format(v)

export const dataCurta = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

export const dataHora = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

export function haQuantoTempo(iso: string, agora = new Date()): string {
  const dias = Math.floor((agora.getTime() - new Date(iso).getTime()) / 86_400_000)
  if (dias <= 0) return 'hoje'
  if (dias === 1) return 'ontem'
  return `há ${dias} dias`
}

/** Remove acentos e caixa para a busca ("agua" encontra "Água"). */
export const normalizar = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

export const soDigitos = (s: string) => s.replace(/\D/g, '')

export const ROTULO_STATUS = {
  novo: 'Novo',
  em_atendimento: 'Em atendimento',
  confirmado: 'Confirmado',
  finalizado: 'Finalizado',
  cancelado: 'Cancelado',
} as const

export const ROTULO_ORIGEM = {
  site: 'Site',
  recompra: 'Recompra (site)',
  whatsapp: 'WhatsApp',
  balcao: 'Balcão',
} as const
