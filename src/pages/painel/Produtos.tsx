import { useState, type FormEvent } from 'react'
import { ARTES, ArteProduto } from '../../components/ArteProduto'
import { Modal, Vazio } from '../../components/Comuns'
import { IcEditar, IcEstrela, IcLixeira, IcMais } from '../../components/Icones'
import { brl, normalizar } from '../../lib/formato'
import { useBanco, useLoja } from '../../store/contexto'
import type { Arte, Produto } from '../../types'

type Rascunho = Omit<Produto, 'id' | 'preco'> & { id?: string; preco: string }

const CORES = ['#00a9e8', '#4cc3ee', '#495057', '#e0a030', '#d9483b', '#3d9a5f', '#ee8a2b', '#7a5bc0', '#b98b5a']

export function Produtos() {
  const loja = useLoja()
  const { produtos, categorias } = useBanco()
  const [busca, setBusca] = useState('')
  const [cat, setCat] = useState('')
  const [edicao, setEdicao] = useState<Rascunho | null>(null)
  const [erro, setErro] = useState('')

  const cats = [...categorias].sort((a, b) => a.ordem - b.ordem)
  const nomeCat = new Map(categorias.map((c) => [c.id, c.nome]))
  const termo = normalizar(busca)
  const lista = produtos
    .filter((p) => (!cat || p.categoriaId === cat) && (!termo || normalizar(p.nome).includes(termo)))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { numeric: true }))

  const novo = (): Rascunho => ({
    nome: '', categoriaId: cat || cats[0]?.id || '', descricao: '', unidade: '', preco: '',
    arte: 'caixa', cor: CORES[0], imagemUrl: '', destaque: false, ativo: true,
  })
  const editar = (p: Produto) => setEdicao({ ...p, imagemUrl: p.imagemUrl ?? '', preco: p.preco.toFixed(2).replace('.', ',') })
  const fechar = () => { setEdicao(null); setErro('') }

  const salvar = (e: FormEvent) => {
    e.preventDefault()
    if (!edicao) return
    const preco = Number(edicao.preco.replace(/\./g, '').replace(',', '.'))
    const url = edicao.imagemUrl?.trim() ?? ''
    if (edicao.nome.trim().length < 2) return setErro('Informe o nome do produto.')
    if (!edicao.categoriaId) return setErro('Escolha uma categoria.')
    if (!edicao.unidade.trim()) return setErro('Informe a unidade de venda (ex.: pacote c/ 100 un.).')
    if (!Number.isFinite(preco) || preco <= 0) return setErro('Informe um preço válido, maior que zero.')
    if (url && !/^https:\/\//i.test(url)) return setErro('O endereço da imagem deve começar com https://')
    loja.salvarProduto({ ...edicao, nome: edicao.nome.trim(), unidade: edicao.unidade.trim(), descricao: edicao.descricao.trim(), preco: Math.round(preco * 100) / 100, imagemUrl: url || undefined })
    fechar()
  }

  const campo = <K extends keyof Rascunho>(k: K, v: Rascunho[K]) => setEdicao((r) => (r ? { ...r, [k]: v } : r))

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold uppercase">Produtos</h1>
          <p className="text-grafite-500">O que for alterado aqui aparece na hora no catálogo do site.</p>
        </div>
        <button type="button" className="btn btn-primario" onClick={() => setEdicao(novo())}><IcMais /> Novo produto</button>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input type="search" className="campo sm:max-w-xs" placeholder="Buscar produto" value={busca} onChange={(e) => setBusca(e.target.value)} aria-label="Buscar produto" />
        <select className="campo sm:max-w-xs" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Filtrar por categoria">
          <option value="">Todas as categorias</option>
          {cats.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        <p className="self-center text-sm text-grafite-500">{lista.length} de {produtos.length}</p>
      </div>

      {lista.length === 0 ? (
        <div className="mt-4"><Vazio titulo="Nenhum produto encontrado">Ajuste a busca ou cadastre um novo produto.</Vazio></div>
      ) : (
        <ul className="cartao mt-4 divide-y divide-grafite-100">
          {lista.map((p) => (
            <li key={p.id} className={`flex flex-wrap items-center gap-3 p-3 ${p.ativo ? '' : 'bg-grafite-50'}`} data-testid="linha-produto">
              <ArteProduto arte={p.arte} cor={p.cor} imagemUrl={p.imagemUrl} className={`h-12 w-12 shrink-0 rounded-lg ${p.ativo ? '' : 'opacity-40'}`} />
              <div className="min-w-40 flex-1">
                <p className={`font-semibold leading-tight ${p.ativo ? '' : 'text-grafite-500'}`}>{p.nome}</p>
                <p className="text-sm text-grafite-500">{nomeCat.get(p.categoriaId) ?? 'Sem categoria'} · {p.unidade}</p>
              </div>
              <p className="w-24 text-right font-bold tabular-nums">{brl(p.preco)}</p>
              <div className="flex items-center gap-1">
                <button type="button" title={p.destaque ? 'Remover destaque' : 'Destacar no site'} aria-label={`${p.destaque ? 'Remover destaque de' : 'Destacar'} ${p.nome}`} aria-pressed={p.destaque}
                  className={`grid h-10 w-10 cursor-pointer place-items-center rounded-lg hover:bg-grafite-50 ${p.destaque ? 'text-amber-500' : 'text-grafite-300'}`}
                  onClick={() => loja.salvarProduto({ ...p, destaque: !p.destaque })}>
                  <IcEstrela fill={p.destaque ? 'currentColor' : 'none'} />
                </button>
                <button type="button" role="switch" aria-checked={p.ativo} aria-label={`${p.nome} ativo no site`}
                  className={`relative h-7 w-12 cursor-pointer rounded-full transition-colors ${p.ativo ? 'bg-zap-500' : 'bg-grafite-300'}`}
                  onClick={() => loja.salvarProduto({ ...p, ativo: !p.ativo })}>
                  <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${p.ativo ? 'left-6' : 'left-1'}`} />
                </button>
                <button type="button" className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg text-grafite-600 hover:bg-grafite-50" onClick={() => editar(p)} aria-label={`Editar ${p.nome}`}><IcEditar /></button>
                <button type="button" className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg text-grafite-500 hover:bg-red-50 hover:text-red-700" aria-label={`Excluir ${p.nome}`}
                  onClick={() => window.confirm(`Excluir "${p.nome}" do catálogo? Pedidos antigos não são alterados.`) && loja.excluirProduto(p.id)}><IcLixeira /></button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {edicao && (
        <Modal titulo={edicao.id ? 'Editar produto' : 'Novo produto'} aoFechar={fechar} largo>
          <form onSubmit={salvar} noValidate className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="rotulo" htmlFor="p-nome">Nome</label>
              <input id="p-nome" className="campo" value={edicao.nome} onChange={(e) => campo('nome', e.target.value)} maxLength={80} autoFocus />
            </div>
            <div>
              <label className="rotulo" htmlFor="p-cat">Categoria</label>
              <select id="p-cat" className="campo" value={edicao.categoriaId} onChange={(e) => campo('categoriaId', e.target.value)}>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.nome}{c.ativo ? '' : ' (inativa)'}</option>)}
              </select>
            </div>
            <div>
              <label className="rotulo" htmlFor="p-un">Unidade de venda</label>
              <input id="p-un" className="campo" value={edicao.unidade} onChange={(e) => campo('unidade', e.target.value)} placeholder="pacote c/ 100 un." maxLength={40} />
            </div>
            <div>
              <label className="rotulo" htmlFor="p-preco">Preço (R$)</label>
              <input id="p-preco" className="campo" inputMode="decimal" value={edicao.preco} onChange={(e) => campo('preco', e.target.value.replace(/[^\d.,]/g, ''))} placeholder="0,00" />
            </div>
            <div className="flex items-end gap-5 pb-2">
              <label className="inline-flex cursor-pointer items-center gap-2 font-semibold"><input type="checkbox" className="h-5 w-5 accent-dudu-600" checked={edicao.ativo} onChange={(e) => campo('ativo', e.target.checked)} /> Ativo no site</label>
              <label className="inline-flex cursor-pointer items-center gap-2 font-semibold"><input type="checkbox" className="h-5 w-5 accent-dudu-600" checked={edicao.destaque} onChange={(e) => campo('destaque', e.target.checked)} /> Destaque</label>
            </div>
            <div className="sm:col-span-2">
              <label className="rotulo" htmlFor="p-desc">Descrição</label>
              <textarea id="p-desc" className="campo" rows={2} value={edicao.descricao} onChange={(e) => campo('descricao', e.target.value)} maxLength={240} />
            </div>
            <fieldset className="sm:col-span-2">
              <legend className="rotulo">Imagem</legend>
              <div className="flex gap-4">
                <ArteProduto arte={edicao.arte} cor={edicao.cor} imagemUrl={/^https:\/\//i.test(edicao.imagemUrl ?? '') ? edicao.imagemUrl : undefined} className="h-24 w-24 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <select className="campo !w-auto" value={edicao.arte} onChange={(e) => campo('arte', e.target.value as Arte)} aria-label="Ilustração">
                      {ARTES.map((a) => <option key={a.id} value={a.id}>Ilustração: {a.nome}</option>)}
                    </select>
                    <div className="flex items-center gap-1" role="radiogroup" aria-label="Cor da ilustração">
                      {CORES.map((c) => (
                        <button key={c} type="button" role="radio" aria-checked={edicao.cor === c} aria-label={`Cor ${c}`} onClick={() => campo('cor', c)}
                          className={`h-7 w-7 cursor-pointer rounded-full border-2 ${edicao.cor === c ? 'border-grafite-900' : 'border-white'}`} style={{ background: c }} />
                      ))}
                    </div>
                  </div>
                  <input className="campo" value={edicao.imagemUrl} onChange={(e) => campo('imagemUrl', e.target.value)} placeholder="Ou cole o endereço (https://) de uma foto do produto" aria-label="Endereço da foto" />
                </div>
              </div>
            </fieldset>
            {erro && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 sm:col-span-2">{erro}</p>}
            <div className="flex justify-end gap-2 sm:col-span-2">
              <button type="button" className="btn btn-linha" onClick={fechar}>Cancelar</button>
              <button type="submit" className="btn btn-primario">Salvar produto</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
