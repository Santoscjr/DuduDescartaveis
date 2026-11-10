// Modelo de dados compartilhado entre o site público e o painel da loja.

export type Arte =
  | 'copo' | 'prato' | 'talher' | 'marmita' | 'sacola' | 'caixa' | 'rolo'
  | 'garrafa' | 'galao' | 'lata' | 'pet' | 'frasco' | 'saco' | 'gelo' | 'fosforo'

export interface Categoria {
  id: string
  nome: string
  descricao: string
  arte: Arte
  ordem: number
  ativo: boolean
}

export interface Produto {
  id: string
  nome: string
  categoriaId: string
  descricao: string
  /** Unidade de venda, ex.: "pacote c/ 100 un." */
  unidade: string
  /** Preço em reais. Na demonstração todos os valores são ilustrativos. */
  preco: number
  arte: Arte
  /** Cor de apoio da ilustração. */
  cor: string
  /** URL opcional de foto real; quando vazia usa a ilustração. */
  imagemUrl?: string
  destaque: boolean
  ativo: boolean
}

export type Perfil = 'pf' | 'pj'
export type Atendimento = 'varejo' | 'atacado'
export type Entrega = 'entrega' | 'retirada'
export type Origem = 'site' | 'recompra' | 'whatsapp' | 'balcao'
export type Status = 'novo' | 'em_atendimento' | 'confirmado' | 'finalizado' | 'cancelado'

export interface ItemPedido {
  produtoId: string
  nome: string
  unidade: string
  preco: number
  quantidade: number
}

export interface Pedido {
  id: string
  numero: number
  criadoEm: string
  clienteId: string
  clienteNome: string
  perfil: Perfil
  atendimento: Atendimento
  entrega: Entrega
  bairro?: string
  endereco?: string
  observacoes?: string
  origem: Origem
  status: Status
  itens: ItemPedido[]
}

export interface Cliente {
  id: string
  nome: string
  perfil: Perfil
  /** Nome do responsável, para clientes empresariais. */
  contato?: string
  telefone?: string
  bairro?: string
}

export interface Configuracoes {
  nomeLoja: string
  whatsapp: string
  telefoneFixo: string
  endereco: string
  bairroCidade: string
  horarios: string
  infoDelivery: string
  infoAtacado: string
  saudacaoWhatsapp: string
  instagram: string
  facebook: string
  mapa: string
}

export interface ItemCarrinho {
  produtoId: string
  quantidade: number
}

export interface Banco {
  versao: number
  categorias: Categoria[]
  produtos: Produto[]
  pedidos: Pedido[]
  clientes: Cliente[]
  config: Configuracoes
  carrinho: ItemCarrinho[]
  /** Pedidos feitos neste navegador — base da recompra sem cadastro. */
  meusPedidos: string[]
}
