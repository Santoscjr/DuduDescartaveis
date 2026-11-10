import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Modal, Vazio } from '../../components/Comuns'
import { EtiquetaStatus } from '../../components/LayoutPainel'
import { brl, dataHora, normalizar, ROTULO_ORIGEM, ROTULO_STATUS } from '../../lib/formato'
import { quantidadeItens, totalItens } from '../../lib/pedidos'
import { useBanco, useLoja } from '../../store/contexto'
import type { Status } from '../../types'

const STATUS = Object.keys(ROTULO_STATUS) as Status[]

export function Pedidos() {
  const loja = useLoja()
  const { pedidos } = useBanco()
  const [params, setParams] = useSearchParams()
  const [filtro, setFiltro] = useState<Status | ''>('')
  const [busca, setBusca] = useState('')
  const aberto = pedidos.find((p) => p.id === params.get('abrir'))

  const termo = normalizar(busca)
  const lista = pedidos
    .filter((p) => (!filtro || p.status === filtro) && (!termo || normalizar(`${p.clienteNome} ${p.numero}`).includes(termo)))
    .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))

  const SeletorStatus = ({ id, status }: { id: string; status: Status }) => (
    <select className="campo !min-h-9 !w-auto !py-1 text-sm font-semibold" value={status} aria-label="Alterar status"
      onClick={(e) => e.stopPropagation()} onChange={(e) => loja.alterarStatus(id, e.target.value as Status)}>
      {STATUS.map((s) => <option key={s} value={s}>{ROTULO_STATUS[s]}</option>)}
    </select>
  )

  return (
    <>
      <h1 className="text-3xl font-bold uppercase">Pedidos</h1>
      <p className="text-grafite-500">Solicitações recebidas pelo site e registradas pela equipe. O fechamento da venda continua no PDV da loja.</p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input type="search" className="campo sm:max-w-xs" placeholder="Buscar por cliente ou número" value={busca} onChange={(e) => setBusca(e.target.value)} aria-label="Buscar pedidos" />
        <div className="flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label="Filtrar por status">
          {(['', ...STATUS] as const).map((s) => (
            <button key={s || 'todos'} type="button" aria-pressed={filtro === s} onClick={() => setFiltro(s)}
              className={`shrink-0 cursor-pointer rounded-full border px-3 py-1.5 text-sm font-semibold ${filtro === s ? 'border-grafite-800 bg-grafite-800 text-white' : 'border-grafite-200 bg-white text-grafite-700'}`}>
              {s ? ROTULO_STATUS[s] : 'Todos'} <span className="tabular-nums opacity-70">{s ? pedidos.filter((p) => p.status === s).length : pedidos.length}</span>
            </button>
          ))}
        </div>
      </div>

      {lista.length === 0 ? (
        <div className="mt-4"><Vazio titulo="Nenhuma solicitação encontrada">Ajuste a busca ou o filtro de status.</Vazio></div>
      ) : (
        <ul className="mt-4 space-y-2">
          {lista.map((p) => (
            <li key={p.id} className="cartao flex cursor-pointer flex-wrap items-center gap-x-4 gap-y-2 p-3 hover:border-dudu-500" data-testid="linha-pedido"
              onClick={() => setParams({ abrir: p.id })}>
              <span className="w-14 font-display text-xl font-bold tabular-nums">#{p.numero}</span>
              <div className="min-w-40 flex-1">
                <p className="font-semibold leading-tight">{p.clienteNome}</p>
                <p className="text-sm text-grafite-500">
                  {dataHora(p.criadoEm)} · {p.perfil === 'pj' ? 'Empresa' : 'Pessoa física'} · {p.atendimento === 'atacado' ? 'Atacado' : 'Varejo'} · {p.entrega === 'entrega' ? `Entrega${p.bairro ? ` (${p.bairro})` : ''}` : 'Retirada'} · {ROTULO_ORIGEM[p.origem]}
                </p>
                <p className="mt-0.5 truncate text-sm text-grafite-600">{p.itens.map((i) => `${i.quantidade}× ${i.nome}`).join(' · ')}</p>
              </div>
              <div className="text-right">
                <p className="font-bold tabular-nums">{brl(totalItens(p.itens))}</p>
                <p className="text-xs text-grafite-500">{p.itens.length} itens · {quantidadeItens(p.itens)} vol.</p>
              </div>
              <EtiquetaStatus status={p.status} />
              <SeletorStatus id={p.id} status={p.status} />
            </li>
          ))}
        </ul>
      )}

      {aberto && (
        <Modal titulo={`Pedido nº ${aberto.numero}`} aoFechar={() => setParams({})} largo>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xl font-semibold">{aberto.clienteNome}</p>
              <p className="text-sm text-grafite-500">{dataHora(aberto.criadoEm)} · origem: {ROTULO_ORIGEM[aberto.origem]}</p>
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold">Status <SeletorStatus id={aberto.id} status={aberto.status} /></label>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-grafite-50 p-3 text-sm sm:grid-cols-4">
            <div><dt className="text-grafite-500">Cliente</dt><dd className="font-semibold">{aberto.perfil === 'pj' ? 'Empresa/comerciante' : 'Pessoa física'}</dd></div>
            <div><dt className="text-grafite-500">Atendimento</dt><dd className="font-semibold">{aberto.atendimento === 'atacado' ? 'Atacado' : 'Varejo'}</dd></div>
            <div><dt className="text-grafite-500">Recebimento</dt><dd className="font-semibold">{aberto.entrega === 'entrega' ? 'Entrega' : 'Retirada na loja'}</dd></div>
            <div><dt className="text-grafite-500">Bairro</dt><dd className="font-semibold">{aberto.bairro ?? '—'}</dd></div>
            {aberto.endereco && <div className="col-span-2 sm:col-span-4"><dt className="text-grafite-500">Endereço</dt><dd className="font-semibold">{aberto.endereco}</dd></div>}
            {aberto.observacoes && <div className="col-span-2 sm:col-span-4"><dt className="text-grafite-500">Observações</dt><dd className="font-semibold">{aberto.observacoes}</dd></div>}
          </dl>
          <table className="mt-4 w-full text-sm">
            <thead><tr className="border-b border-grafite-200 text-left text-grafite-500"><th className="py-2 font-semibold">Produto</th><th className="py-2 text-right font-semibold">Qtd.</th><th className="hidden py-2 text-right font-semibold sm:table-cell">Unitário</th><th className="py-2 text-right font-semibold">Total</th></tr></thead>
            <tbody>
              {aberto.itens.map((i) => (
                <tr key={i.produtoId} className="border-b border-grafite-100">
                  <td className="py-2"><span className="font-semibold">{i.nome}</span><span className="block text-xs text-grafite-500">{i.unidade}</span></td>
                  <td className="py-2 text-right tabular-nums">{i.quantidade}</td>
                  <td className="hidden py-2 text-right tabular-nums sm:table-cell">{brl(i.preco)}</td>
                  <td className="py-2 text-right font-semibold tabular-nums">{brl(i.preco * i.quantidade)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr><td colSpan={2} className="pt-3 text-grafite-500">Valores demonstrativos</td><td colSpan={2} className="pt-3 text-right text-lg font-bold tabular-nums">{brl(totalItens(aberto.itens))}</td></tr></tfoot>
          </table>
        </Modal>
      )}
    </>
  )
}
