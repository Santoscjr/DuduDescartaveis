import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArteProduto } from '../../components/ArteProduto'
import { AvisoPrecos, CartaoProduto, ControleCarrinho, Modal, Vazio } from '../../components/Comuns'
import { IcBusca, IcFechar } from '../../components/Icones'
import { brl, normalizar } from '../../lib/formato'
import { useCatalogo } from '../../store/contexto'
import type { Produto } from '../../types'

type Ordem = 'categoria' | 'nome' | 'menor' | 'maior'

export function Catalogo() {
  const { categorias, produtos } = useCatalogo()
  const [params, setParams] = useSearchParams()
  const [aberto, setAberto] = useState<Produto | null>(null)
  const q = params.get('q') ?? ''
  const cat = params.get('cat') ?? ''
  const ordem = (params.get('ord') ?? 'categoria') as Ordem
  const soDestaque = params.get('destaque') === '1'

  const mudar = (chave: string, valor: string) => {
    const novo = new URLSearchParams(params)
    if (valor) novo.set(chave, valor)
    else novo.delete(chave)
    setParams(novo, { replace: true })
  }

  const nomeCat = useMemo(() => new Map(categorias.map((c) => [c.id, c.nome])), [categorias])
  const lista = useMemo(() => {
    const termo = normalizar(q)
    const ordemCat = new Map(categorias.map((c) => [c.id, c.ordem]))
    const filtrados = produtos.filter((p) =>
      (!cat || p.categoriaId === cat) &&
      (!soDestaque || p.destaque) &&
      (!termo || normalizar(`${p.nome} ${p.descricao} ${nomeCat.get(p.categoriaId) ?? ''}`).includes(termo)))
    const porNome = (a: Produto, b: Produto) => a.nome.localeCompare(b.nome, 'pt-BR', { numeric: true })
    return filtrados.sort((a, b) =>
      ordem === 'nome' ? porNome(a, b)
        : ordem === 'menor' ? a.preco - b.preco
        : ordem === 'maior' ? b.preco - a.preco
        : (ordemCat.get(a.categoriaId)! - ordemCat.get(b.categoriaId)!) || porNome(a, b))
  }, [produtos, categorias, nomeCat, q, cat, ordem, soDestaque])

  const chip = (ativo: boolean) =>
    `shrink-0 cursor-pointer rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${ativo ? 'border-grafite-800 bg-grafite-800 text-white' : 'border-grafite-200 bg-white text-grafite-700 hover:border-grafite-500'}`
  const temFiltro = q || cat || soDestaque

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="titulo-secao">Catálogo</h1>
      <AvisoPrecos className="mt-3" />

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Buscar produto</span>
          <IcBusca className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-grafite-500" />
          <input type="search" className="campo !pl-10" placeholder="Buscar: copo, marmita, água, carvão…" value={q} onChange={(e) => mudar('q', e.target.value)} />
        </label>
        <label className="sm:w-56">
          <span className="sr-only">Ordenar por</span>
          <select className="campo" value={ordem} onChange={(e) => mudar('ord', e.target.value === 'categoria' ? '' : e.target.value)}>
            <option value="categoria">Ordenar: por categoria</option>
            <option value="nome">Ordenar: nome (A–Z)</option>
            <option value="menor">Ordenar: menor preço</option>
            <option value="maior">Ordenar: maior preço</option>
          </select>
        </label>
      </div>

      <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-2" role="group" aria-label="Filtrar por categoria">
        <button type="button" className={chip(!cat)} aria-pressed={!cat} onClick={() => mudar('cat', '')}>Todas</button>
        {categorias.map((c) => (
          <button key={c.id} type="button" className={chip(cat === c.id)} aria-pressed={cat === c.id} onClick={() => mudar('cat', cat === c.id ? '' : c.id)}>{c.nome}</button>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <label className="inline-flex cursor-pointer items-center gap-2 font-medium text-grafite-700">
          <input type="checkbox" className="h-5 w-5 accent-dudu-600" checked={soDestaque} onChange={(e) => mudar('destaque', e.target.checked ? '1' : '')} />
          Só destaques
        </label>
        <span className="text-grafite-500" data-testid="contagem">{lista.length} {lista.length === 1 ? 'produto' : 'produtos'}</span>
        {temFiltro && (
          <button type="button" className="inline-flex cursor-pointer items-center gap-1 font-semibold text-dudu-700 hover:underline" onClick={() => setParams({}, { replace: true })}>
            <IcFechar width={14} height={14} /> Limpar filtros
          </button>
        )}
      </div>

      {lista.length === 0 ? (
        <div className="mt-6">
          <Vazio titulo="Nenhum produto encontrado">
            Tente outro termo ou limpe os filtros. Se não achou o que procura, pergunte pelo WhatsApp — a loja tem mais itens do que os desta demonstração.
          </Vazio>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {lista.map((p) => <CartaoProduto key={p.id} produto={p} categoria={nomeCat.get(p.categoriaId)} aoAbrir={() => setAberto(p)} />)}
        </div>
      )}

      {aberto && (
        <Modal titulo="Detalhes do produto" aoFechar={() => setAberto(null)}>
          <div className="grid gap-5 sm:grid-cols-[200px_1fr]">
            <ArteProduto arte={aberto.arte} cor={aberto.cor} imagemUrl={aberto.imagemUrl} nome={aberto.nome} className="aspect-square w-full rounded-xl" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-dudu-700">{nomeCat.get(aberto.categoriaId)}</p>
              <h3 className="text-2xl font-semibold leading-tight">{aberto.nome}</h3>
              <p className="mt-2 text-grafite-600">{aberto.descricao}</p>
              <p className="mt-3 text-sm text-grafite-500">Unidade de venda: <strong className="text-grafite-800">{aberto.unidade}</strong></p>
              <p className="mt-3 text-3xl font-bold tabular-nums">{brl(aberto.preco)}</p>
              <p className="text-xs text-grafite-500">Preço ilustrativo — imagem demonstrativa.</p>
              <div className="mt-4"><ControleCarrinho produto={aberto} /></div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
