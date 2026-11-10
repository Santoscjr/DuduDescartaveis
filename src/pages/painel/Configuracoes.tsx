import { useState, type FormEvent } from 'react'
import { useBanco, useLoja } from '../../store/contexto'
import type { Configuracoes as Config } from '../../types'

const CAMPOS: { grupo: string; itens: [keyof Config, string, ('texto' | 'area')?, string?][] }[] = [
  { grupo: 'Informações da loja', itens: [
    ['nomeLoja', 'Nome da loja'],
    ['endereco', 'Endereço'],
    ['bairroCidade', 'Bairro e cidade'],
    ['horarios', 'Horários de funcionamento', 'area', 'Ainda não confirmados com a loja. Ex.: Seg a sáb, 8h às 18h.'],
  ] },
  { grupo: 'Contato', itens: [
    ['whatsapp', 'WhatsApp comercial', 'texto', 'Número que recebe as solicitações do site.'],
    ['telefoneFixo', 'Telefone fixo', 'texto', 'Visto na fachada; ainda não validado, por isso não aparece no site.'],
    ['instagram', 'Instagram'],
    ['facebook', 'Facebook'],
    ['mapa', 'Link do Google Maps'],
  ] },
  { grupo: 'Delivery e atacado', itens: [
    ['infoDelivery', 'Aviso sobre entregas', 'area', 'Exibido no pedido quando o cliente escolhe entrega.'],
    ['infoAtacado', 'Aviso sobre atacado', 'area', 'Exibido na página de atacado e no pedido.'],
  ] },
  { grupo: 'Mensagens comerciais', itens: [
    ['saudacaoWhatsapp', 'Abertura da mensagem do WhatsApp', 'area', 'Primeira linha da mensagem que o cliente envia.'],
  ] },
]

export function Configuracoes() {
  const loja = useLoja()
  const { config } = useBanco()
  const [form, setForm] = useState<Config>(config)
  const [salvo, setSalvo] = useState(false)
  const [erro, setErro] = useState('')

  const salvar = (e: FormEvent) => {
    e.preventDefault()
    if (form.whatsapp.replace(/\D/g, '').length < 10) return setErro('Informe o WhatsApp com DDD.')
    for (const k of ['instagram', 'facebook', 'mapa'] as const) {
      if (form[k] && !/^https:\/\//i.test(form[k])) return setErro('Os links devem começar com https://')
    }
    setErro('')
    loja.salvarConfig(form)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2500)
  }

  const restaurar = () => {
    if (!window.confirm('Restaurar a demonstração? Produtos, pedidos, clientes e configurações voltam ao estado inicial neste navegador.')) return
    loja.restaurarDemonstracao()
    setForm(loja.estado().config)
  }

  return (
    <>
      <h1 className="text-3xl font-bold uppercase">Configurações</h1>
      <p className="text-grafite-500">Dados exibidos no site e usados nas mensagens.</p>

      <form onSubmit={salvar} noValidate className="mt-4 space-y-4">
        {CAMPOS.map(({ grupo, itens }) => (
          <fieldset key={grupo} className="cartao p-4">
            <legend className="float-left mb-3 w-full text-xl font-bold uppercase">{grupo}</legend>
            <div className="clear-both grid gap-4 sm:grid-cols-2">
              {itens.map(([k, rotulo, tipo, ajuda]) => (
                <div key={k} className={tipo === 'area' ? 'sm:col-span-2' : ''}>
                  <label className="rotulo" htmlFor={`cfg-${k}`}>{rotulo}</label>
                  {tipo === 'area'
                    ? <textarea id={`cfg-${k}`} className="campo" rows={2} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} maxLength={240} />
                    : <input id={`cfg-${k}`} className="campo" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} maxLength={160} />}
                  {ajuda && <p className="mt-1 text-xs text-grafite-500">{ajuda}</p>}
                </div>
              ))}
            </div>
          </fieldset>
        ))}
        {erro && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{erro}</p>}
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className="btn btn-primario">Salvar configurações</button>
          {salvo && <span role="status" className="font-semibold text-zap-600">Configurações salvas ✓</span>}
        </div>
      </form>

      <section className="cartao mt-8 border-red-200 p-4">
        <h2 className="text-xl font-bold uppercase">Dados da demonstração</h2>
        <p className="mt-1 text-sm text-grafite-600">Tudo o que você alterou fica salvo só neste navegador (não sincroniza com outros aparelhos). Use o botão abaixo para voltar ao estado inicial antes de uma nova apresentação.</p>
        <button type="button" className="btn btn-perigo mt-3" onClick={restaurar}>Restaurar demonstração</button>
      </section>
    </>
  )
}
