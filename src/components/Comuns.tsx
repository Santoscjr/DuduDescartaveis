import { useEffect, type ReactNode } from 'react'
import type { Produto } from '../types'
import { brl } from '../lib/formato'
import { useBanco, useLoja } from '../store/contexto'
import { ArteProduto } from './ArteProduto'
import { IcFechar, IcInfo, IcMais, IcMenos } from './Icones'

export function AvisoPrecos({ className = '' }: { className?: string }) {
  return (
    <p className={`flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 ${className}`}>
      <IcInfo className="mt-0.5 shrink-0" width={18} height={18} />
      <span>
        <strong>Demonstração:</strong> produtos e preços são ilustrativos. Valores, marcas e disponibilidade reais são confirmados pela loja no atendimento.
      </span>
    </p>
  )
}

interface QtdProps {
  valor: number
  aoMudar: (v: number) => void
  rotulo: string
  min?: number
  pequeno?: boolean
}

export function Quantidade({ valor, aoMudar, rotulo, min = 0, pequeno }: QtdProps) {
  const lado = pequeno ? 'h-9 w-9' : 'h-11 w-11'
  return (
    <div className="inline-flex items-center rounded-lg border border-grafite-200 bg-white">
      <button type="button" className={`${lado} grid cursor-pointer place-items-center rounded-l-lg text-grafite-700 hover:bg-grafite-50 disabled:opacity-30`}
        onClick={() => aoMudar(valor - 1)} disabled={valor <= min} aria-label={`Diminuir quantidade de ${rotulo}`}>
        <IcMenos width={16} height={16} />
      </button>
      <input
        className={`${pequeno ? 'h-9 w-10' : 'h-11 w-12'} border-x border-grafite-200 bg-transparent text-center text-[15px] font-semibold tabular-nums focus:outline-none`}
        inputMode="numeric" aria-label={`Quantidade de ${rotulo}`} value={valor}
        onChange={(e) => aoMudar(Math.max(min, Number(e.target.value.replace(/\D/g, '').slice(0, 4)) || min))}
        onFocus={(e) => e.target.select()}
      />
      <button type="button" className={`${lado} grid cursor-pointer place-items-center rounded-r-lg text-grafite-700 hover:bg-grafite-50`}
        onClick={() => aoMudar(valor + 1)} aria-label={`Aumentar quantidade de ${rotulo}`}>
        <IcMais width={16} height={16} />
      </button>
    </div>
  )
}

/** Botão "Adicionar" que vira seletor de quantidade quando o item já está na lista. */
export function ControleCarrinho({ produto, pequeno }: { produto: Produto; pequeno?: boolean }) {
  const loja = useLoja()
  const qtd = useBanco().carrinho.find((i) => i.produtoId === produto.id)?.quantidade ?? 0
  if (qtd > 0) {
    return <Quantidade valor={qtd} aoMudar={(v) => loja.definirQuantidade(produto.id, v)} rotulo={produto.nome} pequeno={pequeno} />
  }
  return (
    <button type="button" className={`btn btn-escuro ${pequeno ? '!min-h-9 !px-3 !py-1 text-sm' : ''}`}
      onClick={() => loja.adicionar(produto.id)} aria-label={`Adicionar ${produto.nome} ao pedido`}>
      <IcMais width={16} height={16} /> Adicionar
    </button>
  )
}

export function CartaoProduto({ produto, categoria, aoAbrir }: { produto: Produto; categoria?: string; aoAbrir?: () => void }) {
  return (
    <article className="cartao flex flex-col overflow-hidden transition-shadow hover:shadow-md" data-testid="produto">
      <button type="button" onClick={aoAbrir} className="relative block cursor-pointer text-left" aria-label={`Ver detalhes de ${produto.nome}`}>
        <ArteProduto arte={produto.arte} cor={produto.cor} imagemUrl={produto.imagemUrl} className="aspect-[4/3] w-full" />
        {produto.destaque && (
          <span className="absolute left-2 top-2 rounded bg-grafite-800 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">Destaque</span>
        )}
      </button>
      <div className="flex flex-1 flex-col p-3">
        {categoria && <p className="text-xs font-semibold uppercase tracking-wide text-dudu-700">{categoria}</p>}
        <h3 className="mt-0.5 text-lg font-semibold leading-tight text-grafite-900">{produto.nome}</h3>
        <p className="mt-0.5 text-sm text-grafite-500">{produto.unidade}</p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-3">
          <p className="leading-none">
            <span className="block text-[11px] font-medium text-grafite-500">preço ilustrativo</span>
            <span className="text-xl font-bold tabular-nums text-grafite-900">{brl(produto.preco)}</span>
          </p>
          <ControleCarrinho produto={produto} pequeno />
        </div>
      </div>
    </article>
  )
}

export function Modal({ titulo, aoFechar, children, largo }: { titulo: string; aoFechar: () => void; children: ReactNode; largo?: boolean }) {
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && aoFechar()
    document.addEventListener('keydown', tecla)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', tecla)
      document.body.style.overflow = ''
    }
  }, [aoFechar])
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-grafite-950/60 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && aoFechar()}>
      <div role="dialog" aria-modal="true" aria-label={titulo}
        className={`flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl ${largo ? 'sm:max-w-3xl' : 'sm:max-w-xl'}`}>
        <div className="flex items-center justify-between gap-3 border-b border-grafite-100 px-5 py-3">
          <h2 className="text-2xl font-bold uppercase text-grafite-900">{titulo}</h2>
          <button type="button" onClick={aoFechar} className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg hover:bg-grafite-50" aria-label="Fechar">
            <IcFechar />
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  )
}

export function Vazio({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-grafite-200 bg-white px-6 py-12 text-center">
      <p className="font-display text-2xl font-semibold text-grafite-800">{titulo}</p>
      {children && <div className="mx-auto mt-2 max-w-md text-grafite-500">{children}</div>}
    </div>
  )
}

/** Opção grande de escolha única (perfil, entrega/retirada). */
export function Opcao({ ativo, aoClicar, icone, titulo, texto }: { ativo: boolean; aoClicar: () => void; icone: ReactNode; titulo: string; texto: string }) {
  return (
    <button type="button" role="radio" aria-checked={ativo} onClick={aoClicar}
      className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 text-left transition-colors ${ativo ? 'border-dudu-500 bg-dudu-50' : 'border-grafite-200 bg-white hover:border-grafite-300'}`}>
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${ativo ? 'bg-dudu-500 text-grafite-950' : 'bg-grafite-50 text-grafite-600'}`}>{icone}</span>
      <span>
        <span className="block font-semibold text-grafite-900">{titulo}</span>
        <span className="block text-sm text-grafite-500">{texto}</span>
      </span>
    </button>
  )
}
