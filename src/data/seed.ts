import type { Banco, Categoria, Cliente, Configuracoes, Pedido, Produto, Arte, Status, Origem } from '../types'

// Dados iniciais da demonstração.
// Informações da loja (endereço, WhatsApp, redes) são públicas e confirmadas.
// Produtos, preços, clientes e pedidos são FICTÍCIOS, criados só para ilustrar o fluxo.

export const VERSAO_BANCO = 1

export const configInicial: Configuracoes = {
  nomeLoja: 'DUDU Descartáveis',
  whatsapp: '(21) 97350-1352',
  telefoneFixo: '(21) 2606-5803',
  endereco: 'Rua Dr. Jurumenha, 5162',
  bairroCidade: 'Barro Vermelho, São Gonçalo - RJ',
  horarios: 'Horário a confirmar com a loja. Consulte pelo WhatsApp.',
  infoDelivery: 'Disponibilidade e taxa de entrega são confirmadas pela equipe no atendimento.',
  infoAtacado: 'Valores e condições para compras em quantidade são confirmados pela loja no orçamento.',
  saudacaoWhatsapp: 'Olá! Montei uma solicitação pelo site da DUDU Descartáveis:',
  instagram: 'https://www.instagram.com/dududescartaveis/',
  facebook: 'https://www.facebook.com/people/DUDU-Descart%C3%A1veis/100063538452339/',
  mapa: 'https://maps.app.goo.gl/fsW7ehtym3BhHsRR6',
}

export const categoriasIniciais: Categoria[] = [
  { id: 'copos', nome: 'Copos e descartáveis', descricao: 'Copos, tampas, canudos e potes', arte: 'copo', ordem: 1, ativo: true },
  { id: 'pratos', nome: 'Pratos e talheres', descricao: 'Para festas, eventos e refeições', arte: 'prato', ordem: 2, ativo: true },
  { id: 'embalagens', nome: 'Embalagens', descricao: 'Marmitas, sacolas, caixas e filmes', arte: 'marmita', ordem: 3, ativo: true },
  { id: 'agua', nome: 'Água mineral', descricao: 'Garrafas, fardos e galões', arte: 'galao', ordem: 4, ativo: true },
  { id: 'refrigerantes', nome: 'Refrigerantes', descricao: 'Latas, garrafas e fardos', arte: 'pet', ordem: 5, ativo: true },
  { id: 'bebidas', nome: 'Bebidas', descricao: 'Sucos, energéticos e gelo', arte: 'lata', ordem: 6, ativo: true },
  { id: 'limpeza', nome: 'Limpeza', descricao: 'Sacos de lixo e produtos de limpeza', arte: 'frasco', ordem: 7, ativo: true },
  { id: 'higiene', nome: 'Higiene', descricao: 'Papel, guardanapos e sabonete', arte: 'rolo', ordem: 8, ativo: true },
  { id: 'carvao', nome: 'Carvão e utilidades', descricao: 'Tudo para o churrasco e o dia a dia', arte: 'saco', ordem: 9, ativo: true },
]

type Linha = [id: string, nome: string, cat: string, unidade: string, preco: number, arte: Arte, cor: string, descricao: string, destaque?: boolean]

const AZUL = '#00a9e8', AGUA = '#4cc3ee', GRAF = '#495057', AMB = '#e0a030', VERM = '#d9483b', VERDE = '#3d9a5f', LAR = '#ee8a2b', ROXO = '#7a5bc0', KRAFT = '#b98b5a'

const linhas: Linha[] = [
  // Copos e descartáveis
  ['copo-200', 'Copo descartável 200 ml', 'copos', 'pacote c/ 100 un.', 6.9, 'copo', AZUL, 'Copo branco para água, suco e refrigerante. O mais pedido para festas e escritórios.', true],
  ['copo-300', 'Copo descartável 300 ml', 'copos', 'pacote c/ 100 un.', 9.5, 'copo', AZUL, 'Copo branco de 300 ml, resistente, para bebidas geladas.'],
  ['copo-cafe', 'Copo descartável 50 ml (café)', 'copos', 'pacote c/ 100 un.', 3.9, 'copo', GRAF, 'Copinho para café e degustação.'],
  ['copo-500', 'Copo transparente 500 ml', 'copos', 'pacote c/ 50 un.', 12.9, 'copo', AGUA, 'Copo transparente para sucos, açaí e vitaminas.'],
  ['tampa-500', 'Tampa para copo 500 ml', 'copos', 'pacote c/ 50 un.', 7.5, 'prato', AGUA, 'Tampa transparente com furo para canudo.'],
  ['canudo', 'Canudo de papel embalado', 'copos', 'pacote c/ 100 un.', 8.9, 'talher', VERM, 'Canudo de papel embalado individualmente.'],
  ['pote-250', 'Pote com tampa 250 ml', 'copos', 'pacote c/ 25 un.', 11.9, 'marmita', AGUA, 'Pote transparente com tampa para sobremesas, molhos e porções.'],
  // Pratos e talheres
  ['prato-15', 'Prato descartável 15 cm', 'pratos', 'pacote c/ 10 un.', 2.9, 'prato', AZUL, 'Prato branco raso para bolo e salgadinhos.'],
  ['prato-21', 'Prato descartável 21 cm', 'pratos', 'pacote c/ 10 un.', 4.5, 'prato', AZUL, 'Prato branco raso para refeições.', true],
  ['prato-fundo', 'Prato fundo descartável', 'pratos', 'pacote c/ 10 un.', 4.9, 'prato', GRAF, 'Prato fundo para caldos, massas e saladas.'],
  ['garfo', 'Garfo descartável', 'pratos', 'pacote c/ 50 un.', 5.9, 'talher', GRAF, 'Garfo de refeição resistente.'],
  ['faca', 'Faca descartável', 'pratos', 'pacote c/ 50 un.', 5.9, 'talher', GRAF, 'Faca de refeição resistente.'],
  ['colher', 'Colher descartável', 'pratos', 'pacote c/ 50 un.', 5.9, 'talher', GRAF, 'Colher de refeição resistente.'],
  ['kit-talher', 'Kit talher com guardanapo', 'pratos', 'pacote c/ 50 kits', 18.9, 'talher', AZUL, 'Garfo, faca e guardanapo embalados. Prático para delivery de refeições.'],
  // Embalagens
  ['marmita-8', 'Marmita de alumínio nº 8', 'embalagens', 'caixa c/ 100 un.', 42.9, 'marmita', GRAF, 'Marmita redonda de alumínio com tampa. Padrão para quentinhas.', true],
  ['marmita-9', 'Marmita de alumínio nº 9', 'embalagens', 'caixa c/ 100 un.', 49.9, 'marmita', GRAF, 'Marmita redonda grande de alumínio com tampa.'],
  ['isopor-3div', 'Marmita térmica 3 divisórias', 'embalagens', 'pacote c/ 100 un.', 54.9, 'marmita', AZUL, 'Embalagem térmica com tampa e três divisórias.'],
  ['hamburguer', 'Embalagem para hambúrguer', 'embalagens', 'pacote c/ 100 un.', 38.9, 'caixa', KRAFT, 'Caixa de papel para hambúrguer artesanal.', true],
  ['sacola-30', 'Sacola plástica 30×40', 'embalagens', 'pacote c/ 1 kg', 16.9, 'sacola', AZUL, 'Sacola alça camiseta reforçada, tamanho médio.'],
  ['sacola-40', 'Sacola plástica 40×50', 'embalagens', 'pacote c/ 1 kg', 16.9, 'sacola', GRAF, 'Sacola alça camiseta reforçada, tamanho grande.'],
  ['saco-kraft', 'Saco de papel kraft delivery', 'embalagens', 'pacote c/ 50 un.', 24.9, 'sacola', KRAFT, 'Saco kraft com fundo quadrado para entregas.'],
  ['filme-pvc', 'Filme PVC 28 cm × 100 m', 'embalagens', 'rolo', 14.9, 'rolo', AGUA, 'Filme esticável para alimentos.'],
  ['papel-aluminio', 'Papel alumínio 30 cm × 7,5 m', 'embalagens', 'rolo', 6.9, 'rolo', GRAF, 'Rolo de papel alumínio para cozinha.'],
  // Água mineral
  ['agua-500', 'Água mineral sem gás 500 ml', 'agua', 'fardo c/ 12 un.', 14.9, 'garrafa', AGUA, 'Fardo com 12 garrafas de 500 ml.', true],
  ['agua-500-gas', 'Água mineral com gás 500 ml', 'agua', 'fardo c/ 12 un.', 17.9, 'garrafa', VERDE, 'Fardo com 12 garrafas de 500 ml, com gás.'],
  ['agua-15', 'Água mineral 1,5 L', 'agua', 'fardo c/ 6 un.', 15.9, 'garrafa', AGUA, 'Fardo com 6 garrafas de 1,5 litro.'],
  ['agua-copo', 'Água mineral copo 200 ml', 'agua', 'caixa c/ 48 un.', 29.9, 'copo', AGUA, 'Caixa com 48 copos lacrados. Ideal para eventos e recepções.'],
  ['galao-20', 'Galão de água mineral 20 L', 'agua', 'unidade (troca)', 12.0, 'galao', AZUL, 'Galão retornável de 20 litros, na troca do vasilhame.', true],
  // Refrigerantes
  ['refri-lata', 'Refrigerante cola lata 350 ml', 'refrigerantes', 'fardo c/ 12 un.', 35.9, 'lata', VERM, 'Fardo com 12 latas de 350 ml.'],
  ['refri-guarana-lata', 'Refrigerante guaraná lata 350 ml', 'refrigerantes', 'fardo c/ 12 un.', 33.9, 'lata', VERDE, 'Fardo com 12 latas de 350 ml.'],
  ['refri-2l', 'Refrigerante cola 2 L', 'refrigerantes', 'fardo c/ 6 un.', 49.9, 'pet', VERM, 'Fardo com 6 garrafas de 2 litros.', true],
  ['refri-guarana-2l', 'Refrigerante guaraná 2 L', 'refrigerantes', 'fardo c/ 6 un.', 44.9, 'pet', VERDE, 'Fardo com 6 garrafas de 2 litros.'],
  ['refri-laranja-2l', 'Refrigerante laranja 2 L', 'refrigerantes', 'fardo c/ 6 un.', 42.9, 'pet', LAR, 'Fardo com 6 garrafas de 2 litros.'],
  // Bebidas
  ['suco-1l', 'Suco pronto 1 L', 'bebidas', 'caixa c/ 12 un.', 59.9, 'caixa', LAR, 'Caixa com 12 unidades, sabores variados.'],
  ['energetico', 'Energético lata 269 ml', 'bebidas', 'fardo c/ 6 un.', 41.9, 'lata', ROXO, 'Fardo com 6 latas.'],
  ['agua-coco', 'Água de coco 1 L', 'bebidas', 'unidade', 8.9, 'caixa', VERDE, 'Água de coco em embalagem de 1 litro.'],
  ['gelo-5kg', 'Gelo em cubos 5 kg', 'bebidas', 'saco', 9.9, 'gelo', AGUA, 'Saco de gelo em cubos para bebidas.', true],
  // Limpeza
  ['lixo-50', 'Saco de lixo 50 L', 'limpeza', 'pacote c/ 50 un.', 13.9, 'saco', GRAF, 'Saco preto reforçado de 50 litros.'],
  ['lixo-100', 'Saco de lixo 100 L', 'limpeza', 'pacote c/ 50 un.', 24.9, 'saco', GRAF, 'Saco preto reforçado de 100 litros.', true],
  ['detergente', 'Detergente neutro 500 ml', 'limpeza', 'unidade', 2.9, 'frasco', AMB, 'Detergente líquido para louças.'],
  ['agua-sanitaria', 'Água sanitária 2 L', 'limpeza', 'unidade', 6.9, 'frasco', AZUL, 'Para limpeza geral e desinfecção.'],
  ['esponja', 'Esponja dupla face', 'limpeza', 'pacote c/ 4 un.', 5.9, 'caixa', VERDE, 'Esponja multiuso para louças.'],
  // Higiene
  ['guardanapo', 'Guardanapo de papel 20×23', 'higiene', 'pacote c/ 50 un.', 2.5, 'caixa', AZUL, 'Guardanapo folha simples para mesa e lanches.', true],
  ['papel-toalha', 'Papel toalha interfolhado', 'higiene', 'pacote c/ 1.000 folhas', 16.9, 'caixa', GRAF, 'Para dispensers de banheiros e cozinhas.'],
  ['papel-higienico', 'Papel higiênico folha dupla', 'higiene', 'fardo c/ 12 rolos', 19.9, 'rolo', AZUL, 'Fardo com 12 rolos de 30 metros.'],
  ['sabonete-liq', 'Sabonete líquido 1 L', 'higiene', 'unidade', 11.9, 'frasco', ROXO, 'Refil para saboneteiras.'],
  // Carvão e utilidades
  ['carvao-3', 'Carvão vegetal 3 kg', 'carvao', 'saco', 15.9, 'saco', KRAFT, 'Carvão para churrasco, saco de 3 kg.', true],
  ['carvao-8', 'Carvão vegetal 8 kg', 'carvao', 'saco', 36.9, 'saco', KRAFT, 'Carvão para churrasco, saco de 8 kg.'],
  ['acendedor', 'Acendedor para churrasqueira', 'carvao', 'unidade', 7.9, 'frasco', VERM, 'Facilita acender o carvão.'],
  ['espeto', 'Espeto de bambu 25 cm', 'carvao', 'pacote c/ 50 un.', 6.5, 'talher', KRAFT, 'Espeto de bambu para churrasco e petiscos.'],
  ['fosforo', 'Fósforo longo', 'carvao', 'caixa c/ 10 caixinhas', 5.9, 'fosforo', VERM, 'Fósforos de segurança.'],
]

export const produtosIniciais: Produto[] = linhas.map(([id, nome, categoriaId, unidade, preco, arte, cor, descricao, destaque]) => ({
  id, nome, categoriaId, unidade, preco, arte, cor, descricao, destaque: !!destaque, ativo: true,
}))

// Clientes fictícios — nomes e telefones inventados (prefixo 0000 não existe na telefonia real).
export const clientesIniciais: Cliente[] = [
  { id: 'c1', nome: 'Restaurante Sabor da Casa', perfil: 'pj', contato: 'Marlene', telefone: '(21) 90000-0101', bairro: 'Barro Vermelho' },
  { id: 'c2', nome: 'Lanchonete do Ponto', perfil: 'pj', contato: 'Robson', telefone: '(21) 90000-0102', bairro: 'Centro' },
  { id: 'c3', nome: 'Buffet Alegria Festas', perfil: 'pj', contato: 'Cíntia', telefone: '(21) 90000-0103', bairro: 'Alcântara' },
  { id: 'c4', nome: 'Ana Paula (demonstração)', perfil: 'pf', telefone: '(21) 90000-0104', bairro: 'Barro Vermelho' },
  { id: 'c5', nome: 'Carlos Eduardo (demonstração)', perfil: 'pf', telefone: '(21) 90000-0105', bairro: 'Santa Catarina' },
  { id: 'c6', nome: 'Quiosque Beira Rio', perfil: 'pj', contato: 'Jorge', telefone: '(21) 90000-0106', bairro: 'Neves' },
]

type PedidoSeed = [cliente: string, diasAtras: number, status: Status, origem: Origem, atacado: boolean, entrega: boolean, itens: [string, number][], obs?: string]

const pedidosSeed: PedidoSeed[] = [
  ['c1', 42, 'finalizado', 'whatsapp', true, true, [['marmita-8', 4], ['copo-300', 5], ['guardanapo', 20], ['kit-talher', 2], ['refri-lata', 3]]],
  ['c3', 30, 'finalizado', 'balcao', true, false, [['prato-21', 30], ['copo-200', 10], ['garfo', 6], ['guardanapo', 30]]],
  ['c1', 28, 'finalizado', 'site', true, true, [['marmita-8', 4], ['copo-300', 5], ['guardanapo', 20], ['kit-talher', 3], ['refri-lata', 4]]],
  ['c2', 21, 'finalizado', 'site', true, true, [['hamburguer', 3], ['saco-kraft', 4], ['refri-lata', 5], ['guardanapo', 10]]],
  ['c4', 16, 'finalizado', 'site', false, false, [['copo-200', 2], ['prato-15', 5], ['refri-2l', 1]]],
  ['c1', 14, 'finalizado', 'recompra', true, true, [['marmita-8', 5], ['copo-300', 5], ['guardanapo', 20], ['kit-talher', 3], ['refri-lata', 4]]],
  ['c6', 9, 'cancelado', 'whatsapp', true, true, [['gelo-5kg', 10], ['copo-500', 6], ['agua-500', 8]], 'Cliente remarcou o evento.'],
  ['c2', 7, 'finalizado', 'recompra', true, true, [['hamburguer', 3], ['saco-kraft', 4], ['refri-lata', 6], ['guardanapo', 10]]],
  ['c5', 4, 'finalizado', 'site', false, true, [['carvao-8', 1], ['gelo-5kg', 2], ['acendedor', 1], ['refri-2l', 1]]],
  ['c3', 2, 'confirmado', 'whatsapp', true, true, [['prato-21', 40], ['copo-200', 15], ['garfo', 8], ['faca', 8], ['guardanapo', 40], ['lixo-100', 2]], 'Evento no sábado. Entregar até sexta à tarde.'],
  ['c6', 1, 'em_atendimento', 'site', true, true, [['gelo-5kg', 12], ['copo-500', 8], ['agua-500', 10], ['canudo', 4]]],
  ['c1', 0, 'novo', 'recompra', true, true, [['marmita-8', 5], ['copo-300', 6], ['guardanapo', 20], ['kit-talher', 3], ['refri-lata', 4]], 'Mesma lista da quinzena passada.'],
  ['c4', 0, 'novo', 'site', false, false, [['galao-20', 2], ['agua-500', 1], ['papel-toalha', 1]]],
]

function montarPedidos(agora: Date): Pedido[] {
  const porId = new Map(produtosIniciais.map((p) => [p.id, p]))
  return pedidosSeed.map(([clienteId, dias, status, origem, atacado, entrega, itens, obs], i) => {
    const cliente = clientesIniciais.find((c) => c.id === clienteId)!
    // Datas relativas ao primeiro acesso, para o painel parecer "vivo" em qualquer dia da apresentação.
    const data = new Date(agora.getTime() - dias * 86_400_000 - (i % 5) * 2_700_000 - 1_800_000)
    return {
      id: `p${1001 + i}`,
      numero: 1001 + i,
      criadoEm: data.toISOString(),
      clienteId,
      clienteNome: cliente.nome,
      perfil: cliente.perfil,
      atendimento: atacado ? 'atacado' : 'varejo',
      entrega: entrega ? 'entrega' : 'retirada',
      bairro: entrega ? cliente.bairro : undefined,
      observacoes: obs,
      origem,
      status,
      itens: itens.map(([pid, quantidade]) => {
        const p = porId.get(pid)!
        return { produtoId: pid, nome: p.nome, unidade: p.unidade, preco: p.preco, quantidade }
      }),
    }
  })
}

export function criarBancoInicial(agora = new Date()): Banco {
  return {
    versao: VERSAO_BANCO,
    categorias: structuredClone(categoriasIniciais),
    produtos: structuredClone(produtosIniciais),
    pedidos: montarPedidos(agora),
    clientes: structuredClone(clientesIniciais),
    config: { ...configInicial },
    carrinho: [],
    meusPedidos: [],
  }
}

/** Cliente fictício usado na tela de recompra para ilustrar o histórico de uma empresa. */
export const CLIENTE_RECOMPRA_DEMO = 'c1'
