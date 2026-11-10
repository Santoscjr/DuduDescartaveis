import { Link } from 'react-router-dom'
import { ArteProduto } from '../../components/ArteProduto'
import { AvisoPrecos, CartaoProduto } from '../../components/Comuns'
import { IcCaminhao, IcInstagram, IcLoja, IcPessoa, IcPin, IcPredio, IcRelogio, IcRepetir, IcSeta, IcWhatsapp } from '../../components/Icones'
import { linkWhatsapp } from '../../lib/pedidos'
import { useBanco, useCatalogo } from '../../store/contexto'

export function Inicio() {
  const { config } = useBanco()
  const { categorias, produtos } = useCatalogo()
  const destaques = produtos.filter((p) => p.destaque).slice(0, 8)
  const vitrine = ['copo-200', 'marmita-8', 'galao-20', 'refri-2l', 'carvao-3', 'sacola-30']
    .map((id) => produtos.find((p) => p.id === id)).filter((p) => !!p)
  const enderecoMapa = encodeURIComponent(`${config.endereco}, ${config.bairroCidade}`)

  return (
    <>
      <section className="bg-grafite-800 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-[1.1fr_.9fr] lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-dudu-300">
              <IcPin width={16} height={16} /> Barro Vermelho · São Gonçalo - RJ
            </p>
            <h1 className="mt-4 text-5xl font-bold uppercase leading-[0.95] sm:text-6xl lg:text-7xl">
              Descartáveis, embalagens e bebidas <span className="text-dudu-500">num só lugar</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-grafite-200">
              Para a festa, para o dia a dia e para o seu negócio. Monte seu pedido pelo celular e envie para o nosso WhatsApp — varejo e atacado, com entrega ou retirada na loja.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/catalogo" className="btn btn-primario !px-6 text-lg">Ver catálogo <IcSeta /></Link>
              <a href={linkWhatsapp(config.whatsapp)} target="_blank" rel="noreferrer" className="btn btn-zap !px-6 text-lg">
                <IcWhatsapp /> Falar no WhatsApp
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-grafite-200">
              <li className="flex items-center gap-2"><IcLoja className="text-dudu-500" /> Varejo e atacado</li>
              <li className="flex items-center gap-2"><IcCaminhao className="text-dudu-500" /> Entrega ou retirada</li>
              <li className="flex items-center gap-2"><IcWhatsapp className="text-dudu-500" /> Pedido direto no WhatsApp</li>
            </ul>
          </div>
          <div className="grid grid-cols-3 gap-3" aria-hidden>
            {vitrine.map((p, i) => (
              <div key={p.id} className={`overflow-hidden rounded-2xl ring-1 ring-white/10 ${i % 2 ? 'translate-y-4' : ''}`}>
                <ArteProduto arte={p.arte} cor={p.cor} className="aspect-square w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-6 grid max-w-6xl gap-4 px-4 sm:grid-cols-2">
        <Link to="/catalogo" className="cartao group flex items-start gap-4 p-5 shadow-sm hover:border-dudu-500">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-dudu-100 text-dudu-700"><IcPessoa width={26} height={26} /></span>
          <span>
            <span className="block font-display text-2xl font-bold uppercase">Para você</span>
            <span className="block text-grafite-600">Festa, churrasco ou compras da casa: escolha os produtos, veja os preços e peça com entrega ou retirada.</span>
            <span className="mt-2 inline-flex items-center gap-1 font-semibold text-dudu-700 group-hover:underline">Montar meu pedido <IcSeta width={16} height={16} /></span>
          </span>
        </Link>
        <Link to="/atacado" className="cartao group flex items-start gap-4 p-5 shadow-sm hover:border-dudu-500">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-grafite-800 text-dudu-500"><IcPredio width={26} height={26} /></span>
          <span>
            <span className="block font-display text-2xl font-bold uppercase">Para o seu negócio</span>
            <span className="block text-grafite-600">Restaurante, lanchonete, buffet ou comércio: peça orçamento em quantidade e repita suas compras em um toque.</span>
            <span className="mt-2 inline-flex items-center gap-1 font-semibold text-dudu-700 group-hover:underline">Orçamento de atacado <IcSeta width={16} height={16} /></span>
          </span>
        </Link>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4">
        <h2 className="titulo-secao">O que você encontra aqui</h2>
        <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {categorias.map((c) => (
            <Link key={c.id} to={`/catalogo?cat=${c.id}`} className="cartao group overflow-hidden text-center hover:border-dudu-500">
              <ArteProduto arte={c.arte} className="aspect-square w-full" />
              <span className="block px-1.5 py-2 text-sm font-semibold leading-tight text-grafite-800 group-hover:text-dudu-700">{c.nome}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="titulo-secao">Mais pedidos</h2>
          <Link to="/catalogo" className="inline-flex items-center gap-1 font-semibold text-dudu-700 hover:underline">Ver catálogo completo <IcSeta width={16} height={16} /></Link>
        </div>
        <AvisoPrecos className="mt-4" />
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {destaques.map((p) => <CartaoProduto key={p.id} produto={p} />)}
        </div>
      </section>

      <section className="mt-14 bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="titulo-secao">Pedir é simples</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ['1', 'Escolha os produtos', 'Busque pelo nome ou navegue pelas categorias e defina as quantidades.'],
              ['2', 'Diga como quer receber', 'Entrega ou retirada na loja, para você ou para a sua empresa. Sem cadastro.'],
              ['3', 'Envie pelo WhatsApp', 'A lista chega organizada para a nossa equipe, que confirma valores e disponibilidade.'],
            ].map(([n, t, d]) => (
              <li key={n} className="flex gap-4 rounded-xl bg-grafite-50 p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-dudu-500 font-display text-2xl font-bold text-grafite-950">{n}</span>
                <span><span className="block font-display text-xl font-semibold uppercase">{t}</span><span className="text-grafite-600">{d}</span></span>
              </li>
            ))}
          </ol>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-grafite-100 p-5">
              <IcCaminhao className="text-dudu-600" width={28} height={28} />
              <h3 className="mt-2 text-xl font-semibold uppercase">Entrega</h3>
              <p className="text-grafite-600">Informe o seu bairro no pedido. {config.infoDelivery}</p>
            </div>
            <div className="rounded-xl border border-grafite-100 p-5">
              <IcLoja className="text-dudu-600" width={28} height={28} />
              <h3 className="mt-2 text-xl font-semibold uppercase">Retirada na loja</h3>
              <p className="text-grafite-600">Deixe o pedido separado e retire na {config.endereco}, {config.bairroCidade.split(',')[0]}.</p>
            </div>
            <Link to="/recompra" className="rounded-xl border border-grafite-100 p-5 hover:border-dudu-500">
              <IcRepetir className="text-dudu-600" width={28} height={28} />
              <h3 className="mt-2 text-xl font-semibold uppercase">Pedir de novo</h3>
              <p className="text-grafite-600">Compra sempre os mesmos itens? Reaproveite uma lista anterior e ajuste só as quantidades.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4" id="contato">
        <h2 className="titulo-secao">Onde estamos</h2>
        <div className="mt-5 grid overflow-hidden rounded-2xl border border-grafite-100 bg-white lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-4 p-6">
            <p className="flex gap-3"><IcPin className="mt-1 shrink-0 text-dudu-600" /> <span><strong className="block">{config.endereco}</strong>{config.bairroCidade}</span></p>
            <p className="flex gap-3"><IcRelogio className="mt-1 shrink-0 text-dudu-600" /> <span><strong className="block">Horário de funcionamento</strong>{config.horarios}</span></p>
            <p className="flex gap-3"><IcWhatsapp className="mt-1 shrink-0 text-zap-500" /> <span><strong className="block">WhatsApp</strong>{config.whatsapp}</span></p>
            <div className="flex flex-wrap gap-2 pt-2">
              <a href={config.mapa} target="_blank" rel="noreferrer" className="btn btn-escuro"><IcPin /> Como chegar</a>
              <a href={linkWhatsapp(config.whatsapp)} target="_blank" rel="noreferrer" className="btn btn-zap"><IcWhatsapp /> Chamar no WhatsApp</a>
              <a href={config.instagram} target="_blank" rel="noreferrer" className="btn btn-linha"><IcInstagram /> Instagram</a>
            </div>
          </div>
          <iframe title="Mapa da loja" loading="lazy" className="h-72 w-full border-0 lg:h-full"
            src={`https://www.google.com/maps?q=${enderecoMapa}&output=embed`} referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </section>
    </>
  )
}
