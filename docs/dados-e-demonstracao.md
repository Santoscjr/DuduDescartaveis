# Dados confirmados × demonstrativos

## Confirmado (público ou fornecido para este projeto)

- Nome comercial: DUDU Descartáveis.
- Endereço: Rua Dr. Jurumenha, 5162 — Barro Vermelho, São Gonçalo - RJ.
- WhatsApp comercial: (21) 97350-1352.
- Instagram, Facebook e link do Google Maps usados no site.
- Linhas de produto: descartáveis, embalagens, água mineral, refrigerantes e outras bebidas, utilidades e carvão.
- Atende consumidor final e empresas, no varejo e no atacado, com entrega.

## Ainda não confirmado

| Item | Como aparece na demonstração |
| --- | --- |
| Horário de funcionamento | Não localizado em fonte pública (busca na web sem resultado; Instagram e Google Maps inacessíveis a partir do ambiente de desenvolvimento). Exibido como "a confirmar"; editável em Painel → Configurações. |
| Telefone fixo (21) 2606-5803 | Visto na fachada, não validado. Fica só nas configurações do painel; não aparece no site. |
| Área, taxa e pedido mínimo de entrega | Não informados. O site pede o bairro e avisa que a equipe confirma. |
| Regras e preços de atacado | Não informados. O site avisa que as condições vêm no orçamento. |
| Preços, marcas e estoque | Não informados. Ver abaixo. |
| Logotipo oficial e mascote | Arquivo não fornecido. Usada assinatura tipográfica provisória com as cores da fachada (grafite, azul, branco). |

## Recursos demonstrativos

- **Produtos (51) e categorias (9):** seleção genérica, sem marcas, coerente com o que a loja vende.
- **Preços:** fictícios, sempre acompanhados do aviso "preço ilustrativo". Não há descontos, promoções nem urgência simulada.
- **Imagens:** ilustrações próprias por tipo de produto.
- **Clientes (6) e pedidos (13):** inventados. Telefones com prefixo inexistente (90000-).
- **Indicadores do painel:** calculados a partir desses pedidos; não representam números da loja.
- **Recompra:** histórico fictício de um restaurante, mais os pedidos feitos no próprio navegador.

## Demonstração × produção

| | Demonstração | Produção |
| --- | --- | --- |
| Dados | No navegador (localStorage) | Banco compartilhado entre os aparelhos da loja |
| Painel | Aberto, sem login, sinalizado na tela | Login da equipe e permissões |
| Dados de clientes | Fictícios | Reais, protegidos e visíveis só para a equipe |
| Recompra | Pedidos do próprio navegador + exemplo fictício | Histórico individual com acesso seguro (link ou código) |
| WhatsApp | Link que o cliente aciona | Igual, com opção futura de API oficial |
| Preços e catálogo | Ilustrativos | Tabela oficial mantida pela loja no painel |
| PDV | Independente | Independente (integração não prevista) |
