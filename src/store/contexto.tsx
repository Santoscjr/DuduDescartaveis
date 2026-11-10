import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import type { Banco, Produto } from '../types'
import { Loja } from './loja'
import { criarRepositorioLocal } from './repositorio'

const loja = new Loja(criarRepositorioLocal())
const Ctx = createContext(loja)

export function ProvedorLoja({ children }: { children: ReactNode }) {
  return <Ctx.Provider value={loja}>{children}</Ctx.Provider>
}

export const useLoja = () => useContext(Ctx)

export function useBanco(): Banco {
  const l = useLoja()
  return useSyncExternalStore(l.assinar, l.estado)
}

/** Catálogo como o cliente vê: só produtos e categorias ativos. */
export function useCatalogo() {
  const { categorias, produtos } = useBanco()
  return useMemo(() => {
    const cats = categorias.filter((c) => c.ativo).sort((a, b) => a.ordem - b.ordem)
    const ids = new Set(cats.map((c) => c.id))
    return { categorias: cats, produtos: produtos.filter((p) => p.ativo && ids.has(p.categoriaId)) }
  }, [categorias, produtos])
}

export interface LinhaCarrinho {
  produto: Produto
  quantidade: number
}

export function useCarrinho() {
  const { carrinho } = useBanco()
  const { produtos } = useCatalogo()
  return useMemo(() => {
    const linhas: LinhaCarrinho[] = carrinho.flatMap((i) => {
      const produto = produtos.find((p) => p.id === i.produtoId)
      return produto ? [{ produto, quantidade: i.quantidade }] : []
    })
    return {
      linhas,
      subtotal: Math.round(linhas.reduce((s, l) => s + l.produto.preco * l.quantidade, 0) * 100) / 100,
      volumes: linhas.reduce((s, l) => s + l.quantidade, 0),
    }
  }, [carrinho, produtos])
}
