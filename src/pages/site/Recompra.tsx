import { useNavigate, Link } from 'react-router-dom'
import { Vazio } from '../../components/Comuns'
import { IcInfo, IcRepetir } from '../../components/Icones'
import { CLIENTE_RECOMPRA_DEMO } from '../../data/seed'
import { brl, dataCurta, haQuantoTempo } from '../../lib/formato'
import { pedidosDoCliente, totalItens } from '../../lib/pedidos'
import { useBanco, useLoja } from '../../store/contexto'
import type { Pedido } from '../../types'

export function Recompra() {
  const loja = useLoja()
  const { pedidos, clientes, meusPedidos, carrinho } = useBanco()
  const navegar = useNavigate()
  const cliente = clientes.find((c) => c.id === CLIENTE_RECOMPRA_DEMO)
  const meus = pedidos.filter((p) => meusPedidos.includes(p.id)).sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
  const exemplo = cliente
    ? pedidosDoCliente(pedidos, cliente.id).filter((p) => p.status !== 'cancelado' && !meusPedidos.includes(p.id)).slice(0, 3)
    : []

  const repetir = (p: Pedido, comoCliente?: string) => {
    if (carrinho.length && !window.confirm('Sua lista atual será substituída pelos itens deste pedido. Continuar?')) return
    const r = loja.repetirPedido(p.id)
    if (r.adicionados === 0) {
      window.alert('Os produtos deste pedido não estão mais disponíveis no catálogo.')
      return
    }
    if (r.indisponiveis) window.alert(`${r.indisponiveis} item(ns) deste pedido não estão mais no catálogo e ficaram de fora.`)
    navegar(`/pedido?origem=recompra${comoCliente ? `&cliente=${comoCliente}` : ''}`)
  }

  const Cartao = ({ p, comoCliente }: { p: Pedido; comoCliente?: string }) => (
    <li className="cartao p-4" data-testid="pedido-anterior">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-xl font-semibold uppercase">Pedido nº {p.numero}</p>
          <p className="text-sm text-grafite-500">{dataCurta(p.criadoEm)} ({haQuantoTempo(p.criadoEm)}) · {p.entrega === 'entrega' ? 'Entrega' : 'Retirada'} · {brl(totalItens(p.itens))} <span className="text-xs">(ilustrativo)</span></p>
        </div>
        <button type="button" className="btn btn-primario" onClick={() => repetir(p, comoCliente)}><IcRepetir /> Repetir este pedido</button>
      </div>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {p.itens.map((i) => (
          <li key={i.produtoId} className="rounded-md bg-grafite-50 px-2 py-1 text-sm text-grafite-700"><strong className="tabular-nums">{i.quantidade}×</strong> {i.nome}</li>
        ))}
      </ul>
    </li>
  )

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="titulo-secao">Pedir de novo</h1>
      <p className="mt-1 text-grafite-600">Reaproveite uma lista anterior: os itens voltam para o seu pedido e você só ajusta as quantidades antes de enviar.</p>

      <section className="mt-7">
        <h2 className="text-2xl font-bold uppercase">Seus pedidos neste aparelho</h2>
        {meus.length ? (
          <ul className="mt-3 space-y-3">{meus.map((p) => <Cartao key={p.id} p={p} />)}</ul>
        ) : (
          <div className="mt-3">
            <Vazio titulo="Você ainda não fez pedidos por aqui">
              <p>Quando enviar uma solicitação, ela aparece nesta lista para repetir depois.</p>
              <Link to="/catalogo" className="btn btn-linha mt-4">Ir para o catálogo</Link>
            </Vazio>
          </div>
        )}
      </section>

      {cliente && exemplo.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold uppercase">Exemplo: cliente recorrente</h2>
          <p className="mt-1 flex items-start gap-2 rounded-lg border border-dudu-300 bg-dudu-50 px-3 py-2 text-sm text-grafite-800">
            <IcInfo className="mt-0.5 shrink-0 text-dudu-700" width={18} height={18} />
            <span>
              Histórico <strong>fictício</strong> do “{cliente.nome}”, para demonstrar como um restaurante repetiria a compra da quinzena.
              Na versão de produção, cada cliente acessa apenas o próprio histórico por um link seguro enviado pela loja — nunca digitando só o telefone.
            </span>
          </p>
          <ul className="mt-3 space-y-3">{exemplo.map((p) => <Cartao key={p.id} p={p} comoCliente={cliente.id} />)}</ul>
        </section>
      )}
    </div>
  )
}
