// Teste de ponta a ponta dos cenários principais da demonstração.
// Uso: npm run build && npm run test:e2e   (requer o pacote "playwright" instalado)
// Sobe o "vite preview" em uma porta livre, percorre o fluxo no celular e no desktop
// e grava capturas em e2e/capturas/.
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { chromium, devices } = require('playwright')

const PORTA = 4173 + Math.floor(Math.random() * 500)
const BASE = process.env.URL_DEMO ?? `http://localhost:${PORTA}/`
const PASTA = new URL('./capturas/', import.meta.url).pathname
mkdirSync(PASTA, { recursive: true })

let falhas = 0
// Aceita um valor ou uma função; funções são reavaliadas algumas vezes (a tela pode estar atualizando).
const ate = async (f) => {
  for (let i = 0; i < 6; i++) {
    try { if (await f()) return true } catch { /* tenta de novo */ }
    await new Promise((r) => setTimeout(r, 100))
  }
  return false
}
const ok = async (cond, msg) => {
  const passou = typeof cond === 'function' ? await ate(cond) : !!cond
  console.log(`${passou ? '  ok  ' : ' FALHA'} ${typeof msg === 'function' ? msg() : msg}`)
  if (!passou) falhas++
}

const servidor = process.env.URL_DEMO ? null
  : spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PORTA), '--strictPort'], { stdio: 'ignore' })
const esperar = async () => {
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(BASE)).ok) return } catch { /* ainda subindo */ }
    await new Promise((r) => setTimeout(r, 200))
  }
  throw new Error('servidor não respondeu')
}

async function executar() {
  await esperar()
  const navegador = await chromium.launch()
  const errosConsole = []

  // ---------- Celular: jornada do consumidor ----------
  const celular = await navegador.newContext({ ...devices['Pixel 7'], locale: 'pt-BR' })
  celular.setDefaultTimeout(5000)
  const p = await celular.newPage()
  p.on('pageerror', (e) => errosConsole.push(String(e)))
  p.on('console', (m) => m.type() === 'error' && !m.text().includes('maps') && errosConsole.push(m.text()))
  const foto = (pg, nome) => pg.screenshot({ path: `${PASTA}${nome}.png` })
  const semRolagemLateral = (pg, onde) =>
    ok(async () => await pg.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `sem rolagem lateral: ${onde}`)

  console.log('\nCelular — varejo')
  await p.goto(BASE)
  await ok(async () => await p.getByRole('heading', { level: 1 }).isVisible(), 'página inicial carrega')
  await ok(async () => await p.getByText('Rua Dr. Jurumenha, 5162').first().isVisible(), 'endereço da loja visível')
  await semRolagemLateral(p, 'início')
  await foto(p, 'celular-inicio')

  await p.getByRole('link', { name: /Ver catálogo/ }).first().click()
  await ok(async () => await p.getByText(/preços são ilustrativos/).first().isVisible(), 'aviso de preços ilustrativos')
  await ate(async () => (await p.getByTestId('produto').count()) >= 30)
  const total = await p.getByTestId('produto').count()
  await ok(async () => total >= 30, `catálogo lista ${total} produtos`)

  await p.getByPlaceholder(/Buscar/).fill('agua')
  await p.waitForFunction(() => document.querySelectorAll('[data-testid=produto]').length < 15)
  const achados = await p.getByTestId('produto').allTextContents()
  await ok(async () => achados.length > 0 && achados.some((t) => t.includes('Água mineral')), `busca sem acento encontra água (${achados.length})`)
  await p.getByRole('button', { name: /Adicionar Galão/ }).click()
  await p.getByPlaceholder(/Buscar/).fill('')

  await p.getByRole('button', { name: 'Carvão e utilidades' }).click()
  await ate(async () => (await p.getByTestId('produto').count()) < 10)
  const carvao = await p.getByTestId('produto').count()
  await ok(async () => carvao > 0 && carvao < 10, `filtro por categoria (${carvao})`)
  await p.getByRole('button', { name: /Adicionar Carvão vegetal 3 kg/ }).click()
  await p.getByRole('button', { name: /Aumentar quantidade de Carvão vegetal 3 kg/ }).click()
  await p.getByRole('button', { name: /Adicionar Fósforo/ }).click()
  await ok(async () => (await p.getByTestId('contador-pedido').textContent()) === '3', 'três produtos na lista')
  await semRolagemLateral(p, 'catálogo')
  await foto(p, 'celular-catalogo')

  await p.selectOption('select', 'menor')
  const precos = (await p.getByTestId('produto').locator('.text-xl').allTextContents()).map((t) => Number(t.replace(/[^\d,]/g, '').replace(',', '.')))
  await ok(async () => precos.every((v, i) => i === 0 || v >= precos[i - 1]), 'ordenação por menor preço')

  await p.getByRole('link', { name: /Ver meu pedido/ }).click()
  await ok(async () => (await p.getByTestId('item-pedido').count()) === 3, 'pedido mostra 3 itens')
  await ok(async () => (await p.getByTestId('subtotal').textContent()).includes('49,70'), 'subtotal 2×15,90 + 12,00 + 5,90 = 49,70')
  await p.getByRole('button', { name: /Remover Fósforo/ }).click()
  await p.getByRole('button', { name: /Aumentar quantidade de Galão/ }).first().click()
  await ok(async () => (await p.getByTestId('subtotal').textContent()).includes('55,80'), 'subtotal atualiza ao alterar e remover (55,80)')

  await p.getByRole('button', { name: /Revisar e preparar/ }).click()
  await ok(async () => await p.getByText('Informe o seu nome.').isVisible(), 'valida nome obrigatório')
  await p.getByLabel('Seu nome').fill('Joana Teste')
  await p.getByRole('button', { name: /Revisar e preparar/ }).click()
  await ok(async () => await p.getByText(/Informe o bairro/).isVisible(), 'entrega exige bairro')
  await p.getByLabel('Bairro').fill('Centro')
  await p.getByLabel(/Observações/).fill('Entregar à tarde')
  await semRolagemLateral(p, 'pedido')
  await foto(p, 'celular-pedido')

  // Nenhuma janela pode abrir sozinha ao registrar a solicitação.
  let abriu = false
  celular.on('page', () => { abriu = true })
  await p.getByRole('button', { name: /Revisar e preparar/ }).click()
  await p.getByTestId('mensagem').waitFor()
  const msg = await p.getByTestId('mensagem').textContent()
  await ok(async () => /Joana Teste/.test(msg) && /Varejo/.test(msg) && /Entrega — bairro Centro/.test(msg), 'mensagem com nome, varejo e entrega')
  await ok(async () => /2× Galão/.test(msg) && /2× Carvão/.test(msg) && !/Fósforo/.test(msg), 'mensagem com itens e quantidades corretos')
  await ok(async () => /Valores ilustrativos/.test(msg) && /Entregar à tarde/.test(msg), 'mensagem com aviso e observações')
  const href = await p.getByTestId('abrir-whatsapp').getAttribute('href')
  await ok(async () => href.startsWith('https://wa.me/5521973501352?text='), 'link aponta para o WhatsApp da loja')
  await ok(async () => !abriu, 'WhatsApp não abre automaticamente')
  await foto(p, 'celular-enviado')

  await p.reload()
  await ok(async () => await p.getByTestId('mensagem').isVisible(), 'solicitação persiste após atualizar a página')

  console.log('\nCelular — recompra e retirada')
  await p.goto(`${BASE}#/recompra`)
  await ok(async () => (await p.getByTestId('pedido-anterior').count()) >= 2, 'lista pedidos anteriores (meu + exemplo)')
  await p.getByTestId('pedido-anterior').filter({ hasText: 'Marmita' }).first().getByRole('button', { name: /Repetir/ }).click()
  await p.getByTestId('item-pedido').first().waitFor()
  await ok(async () => (await p.getByTestId('item-pedido').count()) === 5, 'recompra carrega os 5 itens')
  await ok(async () => (await p.getByLabel(/Nome da empresa/).inputValue()) === 'Restaurante Sabor da Casa', 'recompra identifica o cliente demonstrativo')
  await p.getByRole('button', { name: /Aumentar quantidade de Marmita/ }).first().click()
  await p.getByRole('radio', { name: /Retirada na loja/ }).click()
  await ok(async () => !(await p.getByLabel('Bairro').isVisible()), 'retirada não pede endereço')
  await p.getByRole('button', { name: /Revisar e preparar/ }).click()
  const msg2 = await p.getByTestId('mensagem').textContent()
  await ok(async () => /Atacado/.test(msg2) && /Retirada na loja/.test(msg2) && /6× Marmita/.test(msg2), 'mensagem de recompra: atacado, retirada, quantidade ajustada')
  await celular.close()

  // ---------- Desktop: atacado + painel ----------
  console.log('\nDesktop — atacado')
  const desktop = await navegador.newContext({ viewport: { width: 1366, height: 800 }, locale: 'pt-BR' })
  desktop.setDefaultTimeout(5000)
  const d = await desktop.newPage()
  d.on('pageerror', (e) => { errosConsole.push(String(e)); console.log('ERRO NA PÁGINA:', (e.stack || String(e)).slice(0, 600)) })
  d.on('dialog', (dlg) => dlg.accept())
  await d.goto(BASE)
  await foto(d, 'desktop-inicio')
  await d.goto(`${BASE}#/atacado`)
  const linha = (nome) => d.getByTestId('linha-atacado').filter({ hasText: nome })
  await linha('Copo descartável 200 ml').getByRole('textbox').fill('40')
  await linha('Guardanapo de papel').getByRole('textbox').fill('60')
  await linha('Prato descartável 21 cm').getByRole('button', { name: /Aumentar/ }).click()
  await foto(d, 'desktop-atacado')
  await d.getByRole('link', { name: /Solicitar orçamento/ }).click()
  await ok(async () => await d.getByRole('radio', { name: /Empresa/ }).getAttribute('aria-checked') === 'true', 'atacado pré-seleciona empresa')
  await ok(async () => await d.getByRole('radio', { name: 'Atacado' }).getAttribute('aria-checked') === 'true', 'atendimento atacado selecionado')
  await d.getByLabel(/Nome da empresa/).fill('Padaria Teste')
  await d.getByLabel('Bairro').fill('Alcântara')
  await foto(d, 'desktop-pedido')
  await d.getByRole('button', { name: /Revisar e preparar/ }).click()
  const msg3 = await d.getByTestId('mensagem').textContent()
  await ok(async () => /Empresa\/comerciante/.test(msg3) && /40× Copo/.test(msg3) && /60× Guardanapo/.test(msg3), 'mensagem de atacado correta')
  const numero = msg3.match(/nº (\d+)/)[1]

  console.log('\nDesktop — painel')
  await d.getByRole('link', { name: /Ver no painel/ }).click()
  await ok(async () => await d.getByText(/Painel demonstrativo, sem login/).isVisible(), 'painel sinaliza que é demonstrativo')
  const lp = d.getByTestId('linha-pedido').filter({ hasText: 'Padaria Teste' })
  await ok(async () => (await lp.count()) === 1 && (await lp.textContent()).includes(`#${numero}`), 'solicitação aparece no painel')
  await ok(async () => (await lp.textContent()).includes('Novo'), 'status inicial: Novo')
  await foto(d, 'painel-pedidos')
  await lp.getByRole('combobox').selectOption('em_atendimento')
  await ok(async () => (await lp.textContent()).includes('Em atendimento'), 'status alterado para Em atendimento')
  await lp.click()
  await ok(async () => await d.getByRole('dialog').getByText('Copo descartável 200 ml').isVisible(), 'detalhe do pedido mostra os itens')
  await d.keyboard.press('Escape')

  await d.goto(`${BASE}#/painel`)
  await ok(async () => (await d.getByTestId('indicador').first().textContent()).includes('14'), 'visão geral: 13 iniciais + 1 nova = 14 solicitações')
  await foto(d, 'painel-visao-geral')

  await d.goto(`${BASE}#/painel/produtos`)
  await d.getByRole('button', { name: /Novo produto/ }).click()
  await d.getByLabel('Nome').fill('Copo biodegradável 300 ml')
  await d.getByRole('button', { name: /Salvar produto/ }).click()
  await ok(async () => await d.getByRole('alert').isVisible(), 'cadastro valida campos obrigatórios')
  await d.getByLabel('Unidade de venda').fill('pacote c/ 50 un.')
  await d.getByLabel(/Preço/).fill('18,50')
  await foto(d, 'painel-produto')
  await d.getByRole('button', { name: /Salvar produto/ }).click()
  await ok(async () => await d.getByTestId('linha-produto').filter({ hasText: 'Copo biodegradável' }).isVisible(), 'produto cadastrado')

  await d.getByRole('button', { name: 'Editar Copo descartável 200 ml' }).click()
  await d.getByLabel(/Preço/).fill('7,25')
  await d.getByRole('button', { name: /Salvar produto/ }).click()
  await d.getByRole('switch', { name: /Fósforo longo ativo/ }).click()

  await d.goto(`${BASE}#/catalogo?q=copo`)
  const cat = () => d.getByTestId('produto').allTextContents()
  await ok(async () => (await cat()).some((t) => t.includes('Copo biodegradável') && t.includes('18,50')), 'novo produto aparece no catálogo')
  await ok(async () => (await cat()).some((t) => t.includes('Copo descartável 200 ml') && t.includes('7,25')), 'preço editado aparece no catálogo')
  await d.goto(`${BASE}#/catalogo?q=fosforo`)
  await ok(async () => (await d.getByTestId('produto').count()) === 0 && await d.getByText('Nenhum produto encontrado').isVisible(), 'produto desativado some do catálogo (estado vazio)')

  await d.reload()
  await d.goto(`${BASE}#/painel/pedidos`)
  await ok(async () => (await d.getByTestId('linha-pedido').filter({ hasText: 'Padaria Teste' }).textContent()).includes('Em atendimento'), 'status persiste após atualizar a página')

  await d.goto(`${BASE}#/painel/categorias`)
  await d.getByRole('button', { name: 'Descer Copos e descartáveis' }).click()
  await ok(async () => (await d.getByTestId('linha-categoria').first().textContent()).includes('Pratos e talheres'), 'categorias reordenadas')
  await foto(d, 'painel-categorias')
  await d.goto(`${BASE}#/painel/clientes`)
  await ok(async () => await d.getByTestId('cartao-cliente').filter({ hasText: 'Padaria Teste' }).isVisible(), 'novo cliente aparece em Clientes')
  await d.getByTestId('cartao-cliente').filter({ hasText: 'Restaurante Sabor da Casa' }).click()
  await ok(async () => await d.getByRole('dialog').getByText(/a cada \d+ dias/).isVisible(), 'cliente recorrente mostra frequência')
  await foto(d, 'painel-clientes')
  await d.keyboard.press('Escape')

  await d.goto(`${BASE}#/painel/configuracoes`)
  await d.getByLabel('Horários de funcionamento').fill('Seg a sáb, 8h às 18h (teste)')
  await d.getByRole('button', { name: /Salvar configurações/ }).click()
  await d.goto(BASE)
  await ok(async () => await d.getByText('Seg a sáb, 8h às 18h (teste)').first().isVisible(), 'horário editado aparece no site')
  await d.goto(`${BASE}#/painel/configuracoes`)
  await d.getByRole('button', { name: /Restaurar demonstração/ }).click()
  await d.goto(`${BASE}#/painel`)
  await ok(async () => (await d.getByTestId('indicador').first().textContent()).includes('13'), 'restaurar demonstração volta ao estado inicial')

  // Rota interna aberta direto + atualização (comportamento esperado no GitHub Pages).
  const r = await desktop.newPage()
  await r.goto(`${BASE}#/painel/produtos`)
  await r.reload()
  await ok(async () => await r.getByRole('heading', { name: 'Produtos' }).isVisible(), 'link direto + refresh em rota interna')
  await r.goto(`${BASE}#/rota-inexistente`)
  await ok(async () => await r.getByText('Página não encontrada').isVisible(), 'rota inexistente tem página própria')

  // Telas pequenas: painel em 360 px.
  const mini = await navegador.newContext({ viewport: { width: 360, height: 700 }, locale: 'pt-BR' })
  const m = await mini.newPage()
  for (const rota of ['', '#/catalogo', '#/atacado', '#/recompra', '#/painel', '#/painel/pedidos', '#/painel/produtos', '#/painel/clientes', '#/painel/configuracoes']) {
    await m.goto(`${BASE}${rota}`)
    await m.waitForTimeout(150)
    await semRolagemLateral(m, `360px ${rota || 'início'}`)
  }
  await m.goto(`${BASE}#/painel/pedidos`)
  await foto(m, 'mini-painel-pedidos')

  await ok(async () => errosConsole.length === 0, `sem erros no console${errosConsole.length ? ': ' + errosConsole.join(' | ') : ''}`)
  await navegador.close()
}

try {
  await executar()
} catch (e) {
  console.error(e)
  falhas++
} finally {
  servidor?.kill()
}
console.log(falhas ? `\n${falhas} falha(s)` : '\nTodos os cenários passaram.')
process.exit(falhas ? 1 : 0)
