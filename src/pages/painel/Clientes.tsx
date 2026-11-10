import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal } from '../../components/Comuns'
import { EtiquetaStatus } from '../../components/LayoutPainel'
import { brl, dataCurta, haQuantoTempo } from '../../lib/formato'
import { frequenciaDias, pedidosDoCliente, totalItens } from '../../lib/pedidos'
import { useBanco } from '../../store/contexto'
import type { Perfil } from '../../types'

export function Clientes() {
  const { clientes, pedidos } = useBanco()
  const [perfil, setPerfil] = useState<Perfil | ''>('')
  const [abertoId, setAbertoId] = useState<string | null>(null)

  const linhas = clientes
    .filter((c) => !perfil || c.perfil === perfil)
    .map((c) => {
      const hist = pedidosDoCliente(pedidos, c.id)
      const validos = hist.filter((p) => p.status !== 'cancelado')
      return { c, hist, n: validos.length, ultimo: hist[0], freq: frequenciaDias(hist) }
    })
    .sort((a, b) => (b.ultimo?.criadoEm ?? '').localeCompare(a.ultimo?.criadoEm ?? ''))
  const aberto = linhas.find((l) => l.c.id === abertoId)

  return (
    <>
      <h1 className="text-3xl font-bold uppercase">Clientes</h1>
      <p className="text-grafite-500">Quem já pediu pelo canal digital, com histórico e frequência de compra. Todos os dados aqui são fictícios.</p>

      <div className="mt-4 flex gap-1.5" role="group" aria-label="Filtrar por perfil">
        {([['', 'Todos'], ['pj', 'Empresas'], ['pf', 'Pessoas físicas']] as const).map(([v, r]) => (
          <button key={v} type="button" aria-pressed={perfil === v} onClick={() => setPerfil(v)}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm font-semibold ${perfil === v ? 'border-grafite-800 bg-grafite-800 text-white' : 'border-grafite-200 bg-white text-grafite-700'}`}>{r}</button>
        ))}
      </div>

      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {linhas.map(({ c, n, ultimo, freq }) => (
          <li key={c.id}>
            <button type="button" className="cartao w-full cursor-pointer p-4 text-left hover:border-dudu-500" onClick={() => setAbertoId(c.id)} data-testid="cartao-cliente">
              <div className="flex items-start justify-between gap-2">
                <p className="text-lg font-semibold leading-tight">{c.nome}</p>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${c.perfil === 'pj' ? 'bg-grafite-800 text-white' : 'bg-dudu-100 text-dudu-700'}`}>{c.perfil === 'pj' ? 'Empresa · atacado' : 'Pessoa física · varejo'}</span>
              </div>
              <p className="text-sm text-grafite-500">{[c.contato && `Contato: ${c.contato}`, c.telefone, c.bairro].filter(Boolean).join(' · ') || 'Sem dados de contato'}</p>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <div><dt className="text-grafite-500">Pedidos</dt><dd className="font-bold tabular-nums">{n}</dd></div>
                <div><dt className="text-grafite-500">Último</dt><dd className="font-bold">{ultimo ? haQuantoTempo(ultimo.criadoEm) : '—'}</dd></div>
                <div><dt className="text-grafite-500">Frequência</dt><dd className="font-bold">{freq ? `a cada ${freq} dias` : '—'}</dd></div>
              </dl>
              {n >= 2 && <p className="mt-2 inline-block rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-900">Cliente recorrente</p>}
            </button>
          </li>
        ))}
      </ul>

      {aberto && (
        <Modal titulo="Cliente" aoFechar={() => setAbertoId(null)} largo>
          <p className="text-2xl font-semibold">{aberto.c.nome}</p>
          <p className="text-grafite-500">{aberto.c.perfil === 'pj' ? 'Empresa/comerciante' : 'Pessoa física'}{aberto.c.contato ? ` · Contato: ${aberto.c.contato}` : ''}{aberto.c.telefone ? ` · ${aberto.c.telefone}` : ''}{aberto.c.bairro ? ` · ${aberto.c.bairro}` : ''}</p>
          {aberto.freq && aberto.ultimo && (
            <p className="mt-3 rounded-lg bg-dudu-50 px-3 py-2 text-sm">
              Costuma pedir <strong>a cada {aberto.freq} dias</strong>; o último pedido foi {haQuantoTempo(aberto.ultimo.criadoEm)}. Bom momento para oferecer a recompra pelo WhatsApp.
            </p>
          )}
          <h3 className="mt-5 text-xl font-bold uppercase">Histórico</h3>
          {aberto.hist.length === 0 && <p className="text-grafite-500">Nenhuma solicitação registrada.</p>}
          <ul className="mt-2 divide-y divide-grafite-100">
            {aberto.hist.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-3 py-2.5">
                <Link to={`/painel/pedidos?abrir=${p.id}`} className="font-semibold text-dudu-700 hover:underline">#{p.numero}</Link>
                <span className="text-sm text-grafite-500">{dataCurta(p.criadoEm)}</span>
                <span className="min-w-0 flex-1 truncate text-sm">{p.itens.map((i) => `${i.quantidade}× ${i.nome}`).join(' · ')}</span>
                <span className="font-semibold tabular-nums">{brl(totalItens(p.itens))}</span>
                <EtiquetaStatus status={p.status} />
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </>
  )
}
