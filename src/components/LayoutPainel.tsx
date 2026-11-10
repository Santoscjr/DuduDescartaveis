import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { calcularIndicadores } from '../lib/pedidos'
import { useBanco } from '../store/contexto'
import { IcCaixa, IcEngrenagem, IcEtiqueta, IcGrafico, IcInfo, IcLista, IcPessoa } from './Icones'
import { Logo } from './Logo'

const NAV = [
  { para: '/painel', rotulo: 'Visão geral', icone: IcGrafico },
  { para: '/painel/pedidos', rotulo: 'Pedidos', icone: IcLista },
  { para: '/painel/produtos', rotulo: 'Produtos', icone: IcCaixa },
  { para: '/painel/categorias', rotulo: 'Categorias', icone: IcEtiqueta },
  { para: '/painel/clientes', rotulo: 'Clientes', icone: IcPessoa },
  { para: '/painel/configuracoes', rotulo: 'Configurações', icone: IcEngrenagem },
]

export function LayoutPainel() {
  const { pedidos, clientes } = useBanco()
  const novos = calcularIndicadores(pedidos, clientes).novos
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])

  return (
    <div className="min-h-dvh bg-grafite-50 lg:grid lg:grid-cols-[232px_1fr]">
      <aside className="bg-grafite-800 text-white lg:sticky lg:top-0 lg:h-dvh">
        <div className="flex items-center justify-between gap-3 px-4 py-3 lg:block lg:py-5">
          <Link to="/painel"><Logo compacto /></Link>
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-grafite-300 lg:mt-3">Painel da loja</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 lg:flex-col lg:px-3" aria-label="Painel">
          {NAV.map(({ para, rotulo, icone: Icone }) => (
            <NavLink key={para} to={para} end={para === '/painel'}
              className={({ isActive }) => `flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-[15px] font-semibold ${isActive ? 'bg-dudu-500 text-grafite-950' : 'text-grafite-100 hover:bg-white/10'}`}>
              <Icone width={18} height={18} /> {rotulo}
              {para === '/painel/pedidos' && novos > 0 && (
                <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-white px-1.5 text-xs font-bold text-grafite-900">{novos}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="hidden px-3 lg:absolute lg:bottom-4 lg:block lg:w-full">
          <Link to="/" className="block rounded-lg border border-white/20 px-3 py-2 text-center text-sm font-semibold hover:bg-white/10">← Ver o site</Link>
        </div>
      </aside>

      <div className="min-w-0">
        <p className="flex items-start gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          <IcInfo className="mt-0.5 shrink-0" width={16} height={16} />
          <span>
            <strong>Painel demonstrativo, sem login.</strong> Clientes e pedidos são fictícios e tudo fica salvo apenas neste navegador. Na versão de produção o acesso exige usuário e senha da equipe.{' '}
            <Link to="/" className="font-semibold underline lg:hidden">Ver o site</Link>
          </span>
        </p>
        <main className="mx-auto max-w-6xl p-4 sm:p-6"><Outlet /></main>
      </div>
    </div>
  )
}

export function EtiquetaStatus({ status }: { status: keyof typeof CORES }) {
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ${CORES[status][0]}`}>{CORES[status][1]}</span>
}

const CORES = {
  novo: ['bg-dudu-500 text-grafite-950', 'Novo'],
  em_atendimento: ['bg-amber-100 text-amber-900', 'Em atendimento'],
  confirmado: ['bg-violet-100 text-violet-900', 'Confirmado'],
  finalizado: ['bg-emerald-100 text-emerald-900', 'Finalizado'],
  cancelado: ['bg-grafite-100 text-grafite-600', 'Cancelado'],
} as const
