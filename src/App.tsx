import { HashRouter, Link, Route, Routes } from 'react-router-dom'
import { Vazio } from './components/Comuns'
import { LayoutPainel } from './components/LayoutPainel'
import { LayoutSite } from './components/LayoutSite'
import { Categorias } from './pages/painel/Categorias'
import { Clientes } from './pages/painel/Clientes'
import { Configuracoes } from './pages/painel/Configuracoes'
import { Pedidos } from './pages/painel/Pedidos'
import { Produtos } from './pages/painel/Produtos'
import { VisaoGeral } from './pages/painel/VisaoGeral'
import { Atacado } from './pages/site/Atacado'
import { Catalogo } from './pages/site/Catalogo'
import { Enviado } from './pages/site/Enviado'
import { Inicio } from './pages/site/Inicio'
import { PaginaPedido } from './pages/site/Pedido'
import { Recompra } from './pages/site/Recompra'
import { ProvedorLoja } from './store/contexto'

function NaoEncontrada() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Vazio titulo="Página não encontrada">
        <Link to="/" className="btn btn-primario mt-3">Voltar ao início</Link>
      </Vazio>
    </div>
  )
}

// HashRouter: o GitHub Pages só serve arquivos estáticos; com rotas em hash,
// atualizar a página ou abrir um link direto nunca cai em 404.
export function App() {
  return (
    <ProvedorLoja>
      <HashRouter>
        <Routes>
          <Route element={<LayoutSite />}>
            <Route index element={<Inicio />} />
            <Route path="catalogo" element={<Catalogo />} />
            <Route path="atacado" element={<Atacado />} />
            <Route path="recompra" element={<Recompra />} />
            <Route path="pedido" element={<PaginaPedido />} />
            <Route path="pedido/enviado/:id" element={<Enviado />} />
            <Route path="*" element={<NaoEncontrada />} />
          </Route>
          <Route path="painel" element={<LayoutPainel />}>
            <Route index element={<VisaoGeral />} />
            <Route path="pedidos" element={<Pedidos />} />
            <Route path="produtos" element={<Produtos />} />
            <Route path="categorias" element={<Categorias />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="configuracoes" element={<Configuracoes />} />
          </Route>
        </Routes>
      </HashRouter>
    </ProvedorLoja>
  )
}
