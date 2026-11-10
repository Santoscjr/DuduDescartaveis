# DUDU Descartáveis — demonstração da plataforma digital

Demonstração de um canal digital para a DUDU Descartáveis (Barro Vermelho, São Gonçalo - RJ): um **site público** onde o cliente monta o pedido e envia pelo WhatsApp, e um **painel da loja** onde a equipe acompanha as solicitações e mantém o catálogo. As duas interfaces usam o mesmo modelo de dados.

> Produtos, preços, clientes e pedidos são **fictícios**. O PDV da loja continua independente: a plataforma cuida da etapa comercial anterior ao fechamento da venda.

## Tecnologias

React 19 · TypeScript · Vite · Tailwind CSS 4 · React Router (rotas em hash) · Vitest · Playwright (teste de ponta a ponta) · GitHub Actions + GitHub Pages.

## Como executar

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:5173
npm run build      # checagem de tipos + build em dist/
npm run preview    # serve o build localmente
```

## Estrutura

```
src/
  types.ts            modelo de dados (produto, categoria, pedido, cliente, configurações)
  data/seed.ts        dados iniciais da demonstração
  store/
    repositorio.ts    persistência (localStorage) atrás de uma interface
    loja.ts           regras: carrinho, solicitações, produtos, categorias
    contexto.tsx      ligação com o React (hooks)
  lib/                formatação, mensagem do WhatsApp, indicadores
  components/         layout do site e do painel, ilustrações, componentes comuns
  pages/site/         início, catálogo, atacado, pedir de novo, pedido, confirmação
  pages/painel/       visão geral, pedidos, produtos, categorias, clientes, configurações
e2e/fluxo.mjs         teste de ponta a ponta
docs/                 dados confirmados × demonstrativos
```

## Funcionalidades

**Site**
- Início com apresentação da loja, perfis (para você / para o seu negócio), categorias, destaques, endereço, mapa e redes.
- Catálogo com busca (ignora acentos), filtro por categoria, filtro de destaques e ordenação por nome ou preço.
- Lista de pedido com ajuste de quantidades, remoção e subtotal ilustrativo.
- Pedido sem cadastro: pessoa física ou empresa, varejo ou atacado, entrega (pede o bairro) ou retirada.
- Mensagem organizada para o WhatsApp da loja. Nada é enviado sozinho: o cliente confere e toca em "Abrir WhatsApp".
- Atacado: lista rápida para digitar quantidades em volume.
- Pedir de novo: repete pedidos feitos neste aparelho e demonstra o histórico de um cliente recorrente fictício.

**Painel** (`#/painel`, link no rodapé do site)
- Visão geral com indicadores calculados a partir dos pedidos registrados.
- Pedidos: busca, filtro e alteração de status (Novo, Em atendimento, Confirmado, Finalizado, Cancelado).
- Produtos: cadastrar, editar, excluir, ativar/desativar, destacar, trocar preço, categoria, descrição e imagem.
- Categorias: criar, editar, ordenar, ativar/desativar.
- Clientes: perfil, histórico, último pedido e frequência de compra.
- Configurações: dados da loja, WhatsApp, horários, avisos de delivery/atacado e mensagem de abertura; botão para restaurar a demonstração.

## Como usar a demonstração

1. Abra o site, navegue pelo catálogo e adicione produtos.
2. Em **Meu pedido**, informe o nome, escolha o perfil e entrega/retirada e avance.
3. Confira a mensagem preparada (abrir o WhatsApp é opcional).
4. Abra o **Painel da loja**: a solicitação aparece em Pedidos como "Novo".
5. Altere um preço ou cadastre um produto no painel e veja o catálogo atualizar.

Antes de cada apresentação: Painel → Configurações → **Restaurar demonstração**.

### Acesso ao painel

O painel **não tem login** nesta demonstração, e isso está sinalizado na própria tela. Ele não protege nada porque não há nada a proteger: os dados são fictícios e ficam no navegador de quem está usando. Em produção, o painel exige autenticação real (ver "Evoluções").

## Persistência

Modo local: tudo é gravado no `localStorage` do navegador.

- Os dados sobrevivem a atualizar a página e fechar o navegador.
- Site e painel abertos em abas diferentes do **mesmo navegador** se atualizam sozinhos.
- **Não há sincronização entre aparelhos**: um pedido feito no celular não aparece no painel aberto em outro computador.

A persistência está isolada em `src/store/repositorio.ts`; um modo compartilhado (por exemplo, Supabase) entra como outra implementação da mesma interface.

## Testes

```bash
npm test                          # testes unitários das regras (Vitest)
npm run build && npm run test:e2e # fluxo completo no navegador (requer o pacote "playwright")
```

O teste de ponta a ponta percorre, em celular e desktop: busca, filtros, pedido de varejo com entrega, recompra com retirada, orçamento de atacado, registro no painel, mudança de status, cadastro e edição de produto com reflexo no catálogo, persistência após atualizar a página, rotas internas e telas de 360 px. As capturas ficam em `e2e/capturas/`. Para testar a versão publicada: `URL_DEMO=https://santoscjr.github.io/DuduDescartaveis/ npm run test:e2e`.

## Deploy

O workflow `.github/workflows/deploy.yml` roda testes e build a cada push na `main` e publica `dist/` no GitHub Pages.

Configuração necessária uma única vez no GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

O build usa caminhos relativos e rotas em hash (`/#/catalogo`), então funciona em `https://santoscjr.github.io/DuduDescartaveis/` e atualizar a página em qualquer rota não gera erro 404.

## Limitações

- Dados só no navegador; sem sincronização entre aparelhos.
- Painel sem autenticação (demonstrativo).
- Imagens dos produtos são ilustrações; fotos reais entram pelo campo de imagem do produto.
- A logo é uma assinatura tipográfica provisória, não o logotipo oficial.
- Horário de funcionamento não foi localizado em fonte pública e aparece como "a confirmar".
- O WhatsApp é aberto por link (`wa.me`), sem API oficial: a loja recebe a mensagem, mas o status do pedido é atualizado manualmente no painel.

## Evoluções futuras

- Banco compartilhado (Supabase) com login da equipe e regras de acesso por linha (RLS).
- Recompra com identificação segura: link individual enviado pela loja ou código de confirmação, nunca apenas o telefone digitado.
- Tabela oficial de preços e condições de atacado; fotos reais dos produtos.
- Área de entrega e taxas definidas pela loja.
- Aviso automático à equipe quando chega uma solicitação.
