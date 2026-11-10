import { Link } from 'react-router-dom'
import { EtiquetaStatus } from '../../components/LayoutPainel'
import { brl, dataHora, ROTULO_ORIGEM } from '../../lib/formato'
import { calcularIndicadores, totalItens } from '../../lib/pedidos'
import { useBanco } from '../../store/contexto'
import type { Origem } from '../../types'

export function VisaoGeral() {
  const { pedidos, clientes } = useBanco()
  const i = calcularIndicadores(pedidos, clientes)
  const recentes = [...pedidos].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)).slice(0, 6)

  const porOrigem = (Object.keys(ROTULO_ORIGEM) as Origem[])
    .map((o) => ({ o, n: pedidos.filter((p) => p.origem === o).length }))
    .sort((a, b) => b.n - a.n)
  const maxOrigem = Math.max(1, ...porOrigem.map((x) => x.n))

  const contagem = new Map<string, number>()
  for (const p of pedidos) {
    if (p.status === 'cancelado') continue
    for (const it of p.itens) contagem.set(it.nome, (contagem.get(it.nome) ?? 0) + 1)
  }
  const maisPedidos = [...contagem.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)

  const cartoes: [string, number, string, string?][] = [
    ['Solicitações recebidas', i.total, 'no total'],
    ['Novas', i.novos, 'aguardando atendimento', 'border-l-4 !border-l-dudu-500'],
    ['Em atendimento', i.emAtendimento, 'em conversa com o cliente'],
    ['Confirmadas', i.confirmados, 'aguardando entrega/retirada'],
    ['Finalizadas', i.finalizados, 'concluídas'],
    ['Solicitações de atacado', i.atacado, 'orçamentos em quantidade'],
    ['Clientes recorrentes', i.clientesRecorrentes, 'com 2 pedidos ou mais'],
    ['Canceladas', i.cancelados, 'não concluídas'],
  ]

  return (
    <>
      <h1 className="text-3xl font-bold uppercase">Visão geral</h1>
      <p className="text-grafite-500">Indicadores calculados a partir das solicitações registradas nesta demonstração.</p>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cartoes.map(([rotulo, valor, apoio, extra]) => (
          <div key={rotulo} className={`cartao p-4 ${extra ?? ''}`} data-testid="indicador">
            <p className="text-sm font-semibold text-grafite-600">{rotulo}</p>
            <p className="font-display text-4xl font-bold tabular-nums leading-tight">{valor}</p>
            <p className="text-xs text-grafite-500">{apoio}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] [&>*]:min-w-0">
        <section className="cartao p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold uppercase">Últimas solicitações</h2>
            <Link to="/painel/pedidos" className="text-sm font-semibold text-dudu-700 hover:underline">Ver todas →</Link>
          </div>
          <ul className="mt-2 divide-y divide-grafite-100">
            {recentes.map((p) => (
              <li key={p.id}>
                <Link to={`/painel/pedidos?abrir=${p.id}`} className="flex items-center gap-3 py-2.5 hover:bg-grafite-50">
                  <span className="w-12 font-semibold tabular-nums text-grafite-500">#{p.numero}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{p.clienteNome}</span>
                    <span className="block text-xs text-grafite-500">{dataHora(p.criadoEm)} · {p.atendimento === 'atacado' ? 'Atacado' : 'Varejo'} · {brl(totalItens(p.itens))}</span>
                  </span>
                  <EtiquetaStatus status={p.status} />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-4">
          <section className="cartao p-4">
            <h2 className="text-xl font-bold uppercase">De onde vêm os pedidos</h2>
            <ul className="mt-3 space-y-2.5">
              {porOrigem.map(({ o, n }) => (
                <li key={o} className="text-sm">
                  <div className="flex justify-between font-semibold"><span>{ROTULO_ORIGEM[o]}</span><span className="tabular-nums">{n}</span></div>
                  <div className="mt-1 h-2 rounded-full bg-grafite-100"><div className="h-2 rounded-full bg-dudu-500" style={{ width: `${(n / maxOrigem) * 100}%` }} /></div>
                </li>
              ))}
            </ul>
          </section>
          <section className="cartao p-4">
            <h2 className="text-xl font-bold uppercase">Produtos mais solicitados</h2>
            <ol className="mt-2 space-y-1.5 text-sm">
              {maisPedidos.map(([nome, n], k) => (
                <li key={nome} className="flex gap-2"><span className="w-4 font-bold text-dudu-700">{k + 1}</span><span className="flex-1">{nome}</span><span className="tabular-nums text-grafite-500">{n} pedidos</span></li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </>
  )
}
