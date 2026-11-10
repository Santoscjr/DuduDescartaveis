import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Vazio } from '../../components/Comuns'
import { IcCheck, IcWhatsapp } from '../../components/Icones'
import { linkWhatsapp, montarMensagem } from '../../lib/pedidos'
import { useBanco } from '../../store/contexto'

export function Enviado() {
  const { id } = useParams()
  const { pedidos, config, meusPedidos } = useBanco()
  const [copiado, setCopiado] = useState(false)
  // Só mostra solicitações feitas neste navegador; ids de outros pedidos não abrem aqui.
  const pedido = pedidos.find((p) => p.id === id && meusPedidos.includes(p.id))

  if (!pedido) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Vazio titulo="Solicitação não encontrada">
          <p>Ela pode ter sido feita em outro aparelho ou os dados da demonstração foram restaurados.</p>
          <Link to="/catalogo" className="btn btn-primario mt-4">Ir para o catálogo</Link>
        </Vazio>
      </div>
    )
  }

  const mensagem = montarMensagem(pedido, config)
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(mensagem)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      setCopiado(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-start gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-zap-500 text-white"><IcCheck width={26} height={26} /></span>
        <div>
          <h1 className="text-3xl font-bold uppercase sm:text-4xl">Solicitação nº {pedido.numero} pronta</h1>
          <p className="text-grafite-600">Falta só enviar para a loja. Confira a mensagem e toque no botão para abrir o WhatsApp.</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-[#e7ddd3] p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-grafite-600">Mensagem para {config.whatsapp}</p>
        <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-xl rounded-tr-sm bg-[#d9fdd3] p-4 font-sans text-[15px] leading-snug text-grafite-900 shadow-sm" data-testid="mensagem">{mensagem}</pre>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <a href={linkWhatsapp(config.whatsapp, mensagem)} target="_blank" rel="noreferrer" className="btn btn-zap flex-1 !py-3 text-lg" data-testid="abrir-whatsapp">
          <IcWhatsapp /> Abrir WhatsApp e enviar
        </a>
        <button type="button" className="btn btn-linha" onClick={copiar}>{copiado ? 'Mensagem copiada ✓' : 'Copiar mensagem'}</button>
      </div>

      <div className="mt-6 rounded-xl border border-dudu-300 bg-dudu-50 p-4 text-sm text-grafite-800">
        <p><strong>Nesta demonstração</strong>, a solicitação também foi registrada no painel da loja (dados salvos apenas neste navegador). O envio pelo WhatsApp só acontece se você tocar no botão acima.</p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-semibold">
          <Link to="/painel/pedidos" className="text-dudu-700 hover:underline">Ver no painel da loja →</Link>
          <Link to="/catalogo" className="text-dudu-700 hover:underline">Voltar ao catálogo</Link>
        </div>
      </div>
    </div>
  )
}
