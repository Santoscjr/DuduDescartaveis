import { useState, type FormEvent } from 'react'
import { ARTES, ArteProduto } from '../../components/ArteProduto'
import { Modal } from '../../components/Comuns'
import { IcBaixo, IcCima, IcEditar, IcLixeira, IcMais } from '../../components/Icones'
import { useBanco, useLoja } from '../../store/contexto'
import type { Arte, Categoria } from '../../types'

type Rascunho = Pick<Categoria, 'nome' | 'descricao' | 'arte' | 'ativo'> & { id?: string }

export function Categorias() {
  const loja = useLoja()
  const { categorias, produtos } = useBanco()
  const [edicao, setEdicao] = useState<Rascunho | null>(null)
  const [erro, setErro] = useState('')
  const lista = [...categorias].sort((a, b) => a.ordem - b.ordem)
  const fechar = () => { setEdicao(null); setErro('') }

  const salvar = (e: FormEvent) => {
    e.preventDefault()
    if (!edicao) return
    if (edicao.nome.trim().length < 2) return setErro('Informe o nome da categoria.')
    loja.salvarCategoria({ ...edicao, nome: edicao.nome.trim(), descricao: edicao.descricao.trim() })
    fechar()
  }

  const excluir = (c: Categoria) => {
    if (!window.confirm(`Excluir a categoria "${c.nome}"?`)) return
    if (!loja.excluirCategoria(c.id)) window.alert('Esta categoria tem produtos. Mova ou exclua os produtos antes, ou apenas desative a categoria.')
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold uppercase">Categorias</h1>
          <p className="text-grafite-500">A ordem daqui é a ordem em que aparecem no site.</p>
        </div>
        <button type="button" className="btn btn-primario" onClick={() => setEdicao({ nome: '', descricao: '', arte: 'caixa', ativo: true })}><IcMais /> Nova categoria</button>
      </div>

      <ul className="cartao mt-4 divide-y divide-grafite-100">
        {lista.map((c, i) => {
          const n = produtos.filter((p) => p.categoriaId === c.id).length
          return (
            <li key={c.id} className={`flex flex-wrap items-center gap-3 p-3 ${c.ativo ? '' : 'bg-grafite-50'}`} data-testid="linha-categoria">
              <div className="flex flex-col">
                <button type="button" className="grid h-7 w-9 cursor-pointer place-items-center rounded text-grafite-600 hover:bg-grafite-100 disabled:opacity-25" disabled={i === 0} onClick={() => loja.moverCategoria(c.id, -1)} aria-label={`Subir ${c.nome}`}><IcCima width={18} height={18} /></button>
                <button type="button" className="grid h-7 w-9 cursor-pointer place-items-center rounded text-grafite-600 hover:bg-grafite-100 disabled:opacity-25" disabled={i === lista.length - 1} onClick={() => loja.moverCategoria(c.id, 1)} aria-label={`Descer ${c.nome}`}><IcBaixo width={18} height={18} /></button>
              </div>
              <ArteProduto arte={c.arte} className={`h-12 w-12 shrink-0 rounded-lg ${c.ativo ? '' : 'opacity-40'}`} />
              <div className="min-w-40 flex-1">
                <p className={`font-semibold leading-tight ${c.ativo ? '' : 'text-grafite-500'}`}>{c.nome}</p>
                <p className="text-sm text-grafite-500">{n} {n === 1 ? 'produto' : 'produtos'}{c.descricao ? ` · ${c.descricao}` : ''}</p>
              </div>
              <button type="button" role="switch" aria-checked={c.ativo} aria-label={`${c.nome} ativa no site`}
                className={`relative h-7 w-12 cursor-pointer rounded-full transition-colors ${c.ativo ? 'bg-zap-500' : 'bg-grafite-300'}`}
                onClick={() => loja.salvarCategoria({ ...c, ativo: !c.ativo })}>
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${c.ativo ? 'left-6' : 'left-1'}`} />
              </button>
              <button type="button" className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg text-grafite-600 hover:bg-grafite-50" onClick={() => setEdicao(c)} aria-label={`Editar ${c.nome}`}><IcEditar /></button>
              <button type="button" className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg text-grafite-500 hover:bg-red-50 hover:text-red-700" onClick={() => excluir(c)} aria-label={`Excluir ${c.nome}`}><IcLixeira /></button>
            </li>
          )
        })}
      </ul>

      {edicao && (
        <Modal titulo={edicao.id ? 'Editar categoria' : 'Nova categoria'} aoFechar={fechar}>
          <form onSubmit={salvar} noValidate className="space-y-4">
            <div>
              <label className="rotulo" htmlFor="c-nome">Nome</label>
              <input id="c-nome" className="campo" value={edicao.nome} onChange={(e) => setEdicao({ ...edicao, nome: e.target.value })} maxLength={40} autoFocus />
            </div>
            <div>
              <label className="rotulo" htmlFor="c-desc">Descrição curta</label>
              <input id="c-desc" className="campo" value={edicao.descricao} onChange={(e) => setEdicao({ ...edicao, descricao: e.target.value })} maxLength={80} />
            </div>
            <div className="flex items-center gap-3">
              <ArteProduto arte={edicao.arte} className="h-14 w-14 rounded-lg" />
              <select className="campo" value={edicao.arte} onChange={(e) => setEdicao({ ...edicao, arte: e.target.value as Arte })} aria-label="Ilustração">
                {ARTES.map((a) => <option key={a.id} value={a.id}>Ilustração: {a.nome}</option>)}
              </select>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 font-semibold"><input type="checkbox" className="h-5 w-5 accent-dudu-600" checked={edicao.ativo} onChange={(e) => setEdicao({ ...edicao, ativo: e.target.checked })} /> Ativa no site</label>
            {erro && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{erro}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" className="btn btn-linha" onClick={fechar}>Cancelar</button>
              <button type="submit" className="btn btn-primario">Salvar categoria</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
