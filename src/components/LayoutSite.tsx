import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { brl } from '../lib/formato'
import { linkWhatsapp } from '../lib/pedidos'
import { useBanco, useCarrinho } from '../store/contexto'
import { IcFechar, IcInstagram, IcLista, IcMenu, IcPin, IcRelogio, IcWhatsapp } from './Icones'
import { Logo } from './Logo'

const NAV = [
  { para: '/', rotulo: 'Início' },
  { para: '/catalogo', rotulo: 'Catálogo' },
  { para: '/atacado', rotulo: 'Atacado' },
  { para: '/recompra', rotulo: 'Pedir de novo' },
]

export function LayoutSite() {
  const { config } = useBanco()
  const { linhas, subtotal } = useCarrinho()
  const [menu, setMenu] = useState(false)
  const { pathname } = useLocation()
  const noPedido = pathname.startsWith('/pedido')

  useEffect(() => {
    setMenu(false)
    window.scrollTo(0, 0)
  }, [pathname])

  const linkNav = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 font-display text-lg font-semibold uppercase tracking-wide ${isActive ? 'bg-white/10 text-dudu-300' : 'text-white hover:bg-white/10'}`

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">Pular para o conteúdo</a>
      <div className="bg-grafite-950 px-4 py-1.5 text-center text-xs text-grafite-200">
        Versão de demonstração — catálogo e preços ilustrativos.
      </div>
      <header className="sticky top-0 z-40 bg-grafite-800 shadow-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
          <Link to="/" className="mr-auto rounded-lg"><Logo compacto /></Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
            {NAV.map((n) => <NavLink key={n.para} to={n.para} end={n.para === '/'} className={linkNav}>{n.rotulo}</NavLink>)}
          </nav>
          <Link to="/pedido" className="btn btn-primario relative" aria-label={`Meu pedido, ${linhas.length} produtos`}>
            <IcLista /> <span className="hidden sm:inline">Meu pedido</span>
            {linhas.length > 0 && (
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-grafite-900 px-1.5 text-xs font-bold text-white" data-testid="contador-pedido">{linhas.length}</span>
            )}
          </Link>
          <button type="button" className="grid h-11 w-11 cursor-pointer place-items-center rounded-lg text-white hover:bg-white/10 md:hidden"
            onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Menu">
            {menu ? <IcFechar /> : <IcMenu />}
          </button>
        </div>
        {menu && (
          <nav className="flex flex-col gap-1 border-t border-white/10 px-4 py-3 md:hidden" aria-label="Principal (celular)">
            {NAV.map((n) => <NavLink key={n.para} to={n.para} end={n.para === '/'} className={linkNav}>{n.rotulo}</NavLink>)}
          </nav>
        )}
      </header>

      <main id="conteudo" className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-16 bg-grafite-900 text-grafite-200">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-grafite-300">Descartáveis, embalagens, bebidas e utilidades para a sua casa e o seu negócio. Varejo e atacado.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold uppercase text-white">Loja</h2>
            <p className="mt-2 flex gap-2 text-sm"><IcPin className="shrink-0" width={18} height={18} /> <span>{config.endereco}<br />{config.bairroCidade}</span></p>
            <p className="mt-2 flex gap-2 text-sm"><IcRelogio className="shrink-0" width={18} height={18} /> {config.horarios}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold uppercase text-white">Atendimento</h2>
            <ul className="mt-2 space-y-2 text-sm">
              <li><a className="inline-flex items-center gap-2 hover:text-white" href={linkWhatsapp(config.whatsapp)} target="_blank" rel="noreferrer"><IcWhatsapp width={18} height={18} /> WhatsApp {config.whatsapp}</a></li>
              <li><a className="inline-flex items-center gap-2 hover:text-white" href={config.instagram} target="_blank" rel="noreferrer"><IcInstagram width={18} height={18} /> @dududescartaveis</a></li>
              <li><a className="hover:text-white" href={config.facebook} target="_blank" rel="noreferrer">Facebook</a></li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold uppercase text-white">Navegue</h2>
            <ul className="mt-2 space-y-2 text-sm">
              {NAV.map((n) => <li key={n.para}><Link className="hover:text-white" to={n.para}>{n.rotulo}</Link></li>)}
              <li><Link className="hover:text-white" to="/painel">Painel da loja (demonstração)</Link></li>
            </ul>
          </div>
        </div>
        <p className="border-t border-white/10 px-4 py-4 text-center text-xs text-grafite-300">
          Demonstração de plataforma para a DUDU Descartáveis. Produtos, preços, clientes e pedidos exibidos são fictícios.
        </p>
      </footer>

      {/* Barra fixa no celular: o pedido fica sempre a um toque de distância. */}
      {linhas.length > 0 && !noPedido && (
        <div className="sticky bottom-0 z-30 border-t border-grafite-200 bg-white p-3 shadow-[0_-4px_12px_rgba(0,0,0,.08)] md:hidden">
          <Link to="/pedido" className="btn btn-primario w-full justify-between">
            <span className="inline-flex items-center gap-2"><IcLista /> Ver meu pedido ({linhas.length})</span>
            <span className="tabular-nums">{brl(subtotal)}</span>
          </Link>
        </div>
      )}
    </div>
  )
}
