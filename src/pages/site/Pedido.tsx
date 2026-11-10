import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArteProduto } from '../../components/ArteProduto'
import { AvisoPrecos, Opcao, Quantidade, Vazio } from '../../components/Comuns'
import { IcCaminhao, IcLixeira, IcLoja, IcPessoa, IcPredio, IcSeta } from '../../components/Icones'
import { brl } from '../../lib/formato'
import { useBanco, useCarrinho, useLoja } from '../../store/contexto'
import type { Atendimento, Entrega, Perfil } from '../../types'

export function PaginaPedido() {
  const loja = useLoja()
  const { config, clientes } = useBanco()
  const { linhas, subtotal, volumes } = useCarrinho()
  const [params] = useSearchParams()
  const navegar = useNavigate()

  // Recompra demonstrativa: vem com o cliente fictício já identificado.
  const clienteRecompra = clientes.find((c) => c.id === params.get('cliente'))
  const origemRecompra = params.get('origem') === 'recompra'
  const perfilInicial: Perfil = clienteRecompra?.perfil ?? (params.get('perfil') === 'pj' ? 'pj' : 'pf')

  const [nome, setNome] = useState(clienteRecompra?.nome ?? '')
  const [perfil, setPerfil] = useState<Perfil>(perfilInicial)
  const [atendimento, setAtendimento] = useState<Atendimento>(perfilInicial === 'pj' ? 'atacado' : 'varejo')
  const [entrega, setEntrega] = useState<Entrega>('entrega')
  const [bairro, setBairro] = useState(clienteRecompra?.bairro ?? '')
  const [endereco, setEndereco] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Record<string, string>>({})

  const escolherPerfil = (p: Perfil) => {
    setPerfil(p)
    setAtendimento(p === 'pj' ? 'atacado' : 'varejo')
  }

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const novos: Record<string, string> = {}
    if (nome.trim().length < 2) novos.nome = perfil === 'pj' ? 'Informe o nome da empresa ou do responsável.' : 'Informe o seu nome.'
    if (entrega === 'entrega' && bairro.trim().length < 2) novos.bairro = 'Informe o bairro para verificarmos a entrega.'
    setErros(novos)
    if (Object.keys(novos).length) {
      document.getElementById(Object.keys(novos)[0])?.focus()
      return
    }
    const pedido = loja.criarSolicitacao(
      { nome, perfil, atendimento, entrega, bairro, endereco, observacoes: obs, origem: origemRecompra ? 'recompra' : 'site' },
      clienteRecompra?.id,
    )
    if (pedido) navegar(`/pedido/enviado/${pedido.id}`)
  }

  if (linhas.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="titulo-secao mb-5">Meu pedido</h1>
        <Vazio titulo="Sua lista está vazia">
          <p>Adicione produtos pelo catálogo ou reaproveite uma lista anterior.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link to="/catalogo" className="btn btn-primario">Ir para o catálogo</Link>
            <Link to="/recompra" className="btn btn-linha">Pedir de novo</Link>
          </div>
        </Vazio>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="titulo-secao">Meu pedido</h1>
      <p className="mt-1 text-grafite-600">Confira os itens, diga como quer receber e envie para a loja. Isto é uma solicitação: a compra só é confirmada no atendimento.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <section aria-label="Itens do pedido">
          <ul className="cartao divide-y divide-grafite-100">
            {linhas.map(({ produto: p, quantidade }) => (
              <li key={p.id} className="flex items-center gap-3 p-3" data-testid="item-pedido">
                <ArteProduto arte={p.arte} cor={p.cor} imagemUrl={p.imagemUrl} className="h-14 w-14 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-tight">{p.nome}</p>
                  <p className="text-sm text-grafite-500">{p.unidade} · {brl(p.preco)}</p>
                  <div className="mt-2 flex items-center gap-2 sm:hidden">
                    <Quantidade valor={quantidade} min={1} aoMudar={(v) => loja.definirQuantidade(p.id, v)} rotulo={p.nome} pequeno />
                  </div>
                </div>
                <div className="hidden sm:block">
                  <Quantidade valor={quantidade} min={1} aoMudar={(v) => loja.definirQuantidade(p.id, v)} rotulo={p.nome} pequeno />
                </div>
                <p className="w-20 text-right font-bold tabular-nums">{brl(p.preco * quantidade)}</p>
                <button type="button" className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-lg text-grafite-500 hover:bg-red-50 hover:text-red-700"
                  onClick={() => loja.definirQuantidade(p.id, 0)} aria-label={`Remover ${p.nome}`}>
                  <IcLixeira />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <Link to="/catalogo" className="font-semibold text-dudu-700 hover:underline">+ Adicionar mais produtos</Link>
            <button type="button" className="cursor-pointer text-sm font-semibold text-grafite-500 hover:text-red-700"
              onClick={() => window.confirm('Remover todos os itens da lista?') && loja.limparCarrinho()}>Esvaziar lista</button>
          </div>
          <div className="cartao mt-4 p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-grafite-600">{linhas.length} {linhas.length === 1 ? 'produto' : 'produtos'} · {volumes} volumes</span>
              <span className="text-right"><span className="block text-xs text-grafite-500">Subtotal ilustrativo</span><strong className="text-2xl tabular-nums" data-testid="subtotal">{brl(subtotal)}</strong></span>
            </div>
          </div>
          <AvisoPrecos className="mt-3" />
        </section>

        <form onSubmit={enviar} noValidate className="cartao space-y-5 p-5 lg:self-start">
          <h2 className="text-2xl font-bold uppercase">Como podemos atender?</h2>

          <fieldset>
            <legend className="rotulo">Quem está comprando?</legend>
            <div className="grid gap-2 sm:grid-cols-2" role="radiogroup">
              <Opcao ativo={perfil === 'pf'} aoClicar={() => escolherPerfil('pf')} icone={<IcPessoa />} titulo="Pessoa física" texto="Para casa, festa ou churrasco" />
              <Opcao ativo={perfil === 'pj'} aoClicar={() => escolherPerfil('pj')} icone={<IcPredio />} titulo="Empresa / comerciante" texto="Restaurante, loja, buffet…" />
            </div>
          </fieldset>

          <div>
            <label className="rotulo" htmlFor="nome">{perfil === 'pj' ? 'Nome da empresa ou do responsável' : 'Seu nome'}</label>
            <input id="nome" className="campo" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" maxLength={80}
              aria-invalid={!!erros.nome} aria-describedby={erros.nome ? 'erro-nome' : undefined} />
            {erros.nome && <p id="erro-nome" className="mt-1 text-sm font-medium text-red-700">{erros.nome}</p>}
          </div>

          <fieldset>
            <legend className="rotulo">Tipo de atendimento</legend>
            <div className="grid grid-cols-2 gap-2" role="radiogroup">
              {(['varejo', 'atacado'] as const).map((a) => (
                <button key={a} type="button" role="radio" aria-checked={atendimento === a} onClick={() => setAtendimento(a)}
                  className={`min-h-11 cursor-pointer rounded-lg border-2 px-3 py-2 font-semibold ${atendimento === a ? 'border-dudu-500 bg-dudu-50 text-grafite-900' : 'border-grafite-200 text-grafite-600 hover:border-grafite-300'}`}>
                  {a === 'varejo' ? 'Varejo' : 'Atacado'}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-sm text-grafite-500">
              {atendimento === 'atacado' ? `Orçamento em quantidade. ${config.infoAtacado}` : 'Compra em pequenas quantidades.'}
            </p>
          </fieldset>

          <fieldset>
            <legend className="rotulo">Como quer receber?</legend>
            <div className="grid gap-2 sm:grid-cols-2" role="radiogroup">
              <Opcao ativo={entrega === 'entrega'} aoClicar={() => setEntrega('entrega')} icone={<IcCaminhao />} titulo="Entrega" texto="Receba no seu endereço" />
              <Opcao ativo={entrega === 'retirada'} aoClicar={() => setEntrega('retirada')} icone={<IcLoja />} titulo="Retirada na loja" texto={config.endereco} />
            </div>
          </fieldset>

          {entrega === 'entrega' && (
            <div className="space-y-3 rounded-lg bg-grafite-50 p-3">
              <div>
                <label className="rotulo" htmlFor="bairro">Bairro</label>
                <input id="bairro" className="campo" value={bairro} onChange={(e) => setBairro(e.target.value)} maxLength={60}
                  aria-invalid={!!erros.bairro} aria-describedby={erros.bairro ? 'erro-bairro' : undefined} />
                {erros.bairro && <p id="erro-bairro" className="mt-1 text-sm font-medium text-red-700">{erros.bairro}</p>}
              </div>
              <div>
                <label className="rotulo" htmlFor="endereco">Endereço <span className="font-normal text-grafite-500">(opcional — pode combinar no WhatsApp)</span></label>
                <input id="endereco" className="campo" value={endereco} onChange={(e) => setEndereco(e.target.value)} autoComplete="street-address" maxLength={120} />
              </div>
              <p className="text-sm text-grafite-600">{config.infoDelivery}</p>
            </div>
          )}

          <div>
            <label className="rotulo" htmlFor="obs">Observações <span className="font-normal text-grafite-500">(opcional)</span></label>
            <textarea id="obs" className="campo" rows={2} value={obs} onChange={(e) => setObs(e.target.value)} maxLength={300}
              placeholder="Ex.: preciso para sábado, marca de preferência…" />
          </div>

          <button type="submit" className="btn btn-primario w-full !py-3 text-lg">Revisar e preparar mensagem <IcSeta /></button>
          <p className="text-center text-xs text-grafite-500">Nada é enviado automaticamente: no próximo passo você confere a mensagem e decide abrir o WhatsApp.</p>
        </form>
      </div>
    </div>
  )
}
