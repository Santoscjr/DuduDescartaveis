import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArteProduto } from '../../components/ArteProduto'
import { AvisoPrecos, Quantidade } from '../../components/Comuns'
import { IcBusca, IcCheck, IcRepetir, IcSeta } from '../../components/Icones'
import { brl, normalizar } from '../../lib/formato'
import { useBanco, useCarrinho, useCatalogo, useLoja } from '../../store/contexto'

export function Atacado() {
  const loja = useLoja()
  const { config, carrinho } = useBanco()
  const { categorias, produtos } = useCatalogo()
  const { linhas, subtotal, volumes } = useCarrinho()
  const [q, setQ] = useState('')
  const termo = normalizar(q)
  const qtd = useMemo(() => new Map(carrinho.map((i) => [i.produtoId, i.quantidade])), [carrinho])

  return (
    <div>
      <section className="bg-grafite-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="font-display text-lg font-semibold uppercase tracking-widest text-dudu-500">Empresas e comerciantes</p>
          <h1 className="mt-1 max-w-3xl text-4xl font-bold uppercase leading-none sm:text-5xl">Orçamento de atacado sem ligar, sem esperar na fila</h1>
          <p className="mt-4 max-w-2xl text-lg text-grafite-200">
            Preencha as quantidades na lista abaixo e envie para a nossa equipe. Você recebe o orçamento pelo WhatsApp.
          </p>
          <ul className="mt-5 grid gap-2 text-grafite-100 sm:grid-cols-3">
            {['Lista rápida para compras em volume', 'Entrega ou retirada na loja', 'Repita o último pedido em um toque'].map((t) => (
              <li key={t} className="flex items-center gap-2"><IcCheck className="shrink-0 text-dudu-500" /> {t}</li>
            ))}
          </ul>
          <p className="mt-5 max-w-2xl rounded-lg bg-white/10 px-3 py-2 text-sm text-grafite-100">{config.infoAtacado}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-3xl font-bold uppercase">Lista rápida</h2>
            <Link to="/recompra" className="inline-flex items-center gap-1.5 font-semibold text-dudu-700 hover:underline"><IcRepetir width={18} height={18} /> Repetir um pedido anterior</Link>
          </div>
          <AvisoPrecos className="mt-3" />
          <label className="relative mt-3 block">
            <span className="sr-only">Filtrar a lista</span>
            <IcBusca className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-grafite-500" />
            <input type="search" className="campo !pl-10" placeholder="Filtrar a lista…" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>

          {categorias.map((c) => {
            const itens = produtos.filter((p) => p.categoriaId === c.id && (!termo || normalizar(p.nome).includes(termo)))
            if (!itens.length) return null
            return (
              <section key={c.id} className="mt-5">
                <h3 className="rounded-t-lg bg-grafite-700 px-3 py-2 text-lg font-semibold uppercase tracking-wide text-white">{c.nome}</h3>
                <ul className="divide-y divide-grafite-100 rounded-b-lg border border-t-0 border-grafite-100 bg-white">
                  {itens.map((p) => (
                    <li key={p.id} className={`flex items-center gap-3 px-3 py-2 ${qtd.get(p.id) ? 'bg-dudu-50' : ''}`} data-testid="linha-atacado">
                      <ArteProduto arte={p.arte} cor={p.cor} imagemUrl={p.imagemUrl} className="hidden h-11 w-11 shrink-0 rounded-md sm:block" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold leading-tight">{p.nome}</p>
                        <p className="text-sm text-grafite-500">{p.unidade} · <span className="tabular-nums">{brl(p.preco)}</span></p>
                      </div>
                      <Quantidade valor={qtd.get(p.id) ?? 0} aoMudar={(v) => loja.definirQuantidade(p.id, v)} rotulo={p.nome} pequeno />
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="cartao p-5">
            <h2 className="text-2xl font-bold uppercase">Seu orçamento</h2>
            {linhas.length === 0 ? (
              <p className="mt-2 text-grafite-500">Informe as quantidades na lista para começar.</p>
            ) : (
              <>
                <dl className="mt-3 space-y-1.5 text-[15px]">
                  <div className="flex justify-between"><dt className="text-grafite-600">Produtos</dt><dd className="font-semibold tabular-nums">{linhas.length}</dd></div>
                  <div className="flex justify-between"><dt className="text-grafite-600">Volumes</dt><dd className="font-semibold tabular-nums">{volumes}</dd></div>
                  <div className="flex justify-between border-t border-grafite-100 pt-2"><dt className="text-grafite-600">Subtotal ilustrativo</dt><dd className="text-lg font-bold tabular-nums">{brl(subtotal)}</dd></div>
                </dl>
                <p className="mt-2 text-xs text-grafite-500">Tabela de varejo, apenas como referência. Condições de atacado são informadas no orçamento.</p>
              </>
            )}
            <Link to="/pedido?perfil=pj" className={`btn btn-primario mt-4 w-full ${linhas.length ? '' : 'pointer-events-none opacity-50'}`} aria-disabled={!linhas.length}>
              Solicitar orçamento <IcSeta />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
