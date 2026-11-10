import type { Banco } from '../types'
import { criarBancoInicial, VERSAO_BANCO } from '../data/seed'

// Camada de persistência. Hoje grava no localStorage do navegador (modo local);
// para um modo compartilhado (ex.: Supabase) basta outra implementação desta interface.
export interface Repositorio {
  carregar(): Banco
  salvar(banco: Banco): void
  /** Avisa quando outra aba do mesmo navegador alterou os dados. */
  observar(aoMudar: () => void): () => void
}

const CHAVE = 'dudu-demo:banco'

export function criarRepositorioLocal(storage: Storage | undefined = globalThis.localStorage): Repositorio {
  return {
    carregar() {
      try {
        const bruto = storage?.getItem(CHAVE)
        if (bruto) {
          const banco = JSON.parse(bruto) as Banco
          if (banco.versao === VERSAO_BANCO && Array.isArray(banco.produtos)) return banco
        }
      } catch {
        // Dado corrompido ou storage bloqueado: recomeça dos dados iniciais.
      }
      return criarBancoInicial()
    },
    salvar(banco) {
      try {
        storage?.setItem(CHAVE, JSON.stringify(banco))
      } catch {
        // Navegação privada ou cota cheia: a demonstração segue em memória.
      }
    },
    observar(aoMudar) {
      if (typeof window === 'undefined') return () => {}
      const ouvir = (e: StorageEvent) => {
        if (e.key === CHAVE || e.key === null) aoMudar()
      }
      window.addEventListener('storage', ouvir)
      return () => window.removeEventListener('storage', ouvir)
    },
  }
}
