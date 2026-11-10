import type { ReactNode } from 'react'
import type { Arte } from '../types'

// Ilustrações próprias usadas como imagem demonstrativa dos produtos.
// Evitam fotos de banco sem relação com o item e marcas de terceiros;
// na operação real, cada produto recebe a foto oficial (campo imagemUrl).

const TRACO = '#2b3036'

function desenho(arte: Arte, c: string): ReactNode {
  const s = { stroke: TRACO, strokeWidth: 3, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }
  switch (arte) {
    case 'copo':
      return (<>
        <path d="M36 28h48l-7 66a6 6 0 0 1-6 5H49a6 6 0 0 1-6-5z" fill="#fff" {...s} />
        <path d="M39 50h42l-2.4 20H41.4z" fill={c} {...s} />
        <path d="M33 28h54" {...s} strokeWidth={5} />
      </>)
    case 'prato':
      return (<>
        <ellipse cx="60" cy="64" rx="44" ry="30" fill="#fff" {...s} />
        <ellipse cx="60" cy="62" rx="28" ry="17" fill={c} opacity=".28" />
        <ellipse cx="60" cy="62" rx="28" ry="17" fill="none" {...s} strokeWidth={2} />
      </>)
    case 'talher':
      return (<>
        <path d="M44 24v22a8 8 0 0 0 16 0V24M52 24v72" fill="none" {...s} stroke={c} strokeWidth={5} />
        <path d="M52 24v20" {...s} />
        <path d="M78 96V24c-9 6-12 20-10 36l10 4" fill="#fff" {...s} />
      </>)
    case 'marmita':
      return (<>
        <path d="M22 54h76l-8 34a6 6 0 0 1-6 5H36a6 6 0 0 1-6-5z" fill="#fff" {...s} />
        <path d="M27 66h66l-2 9H29z" fill={c} opacity=".35" />
        <rect x="16" y="42" width="88" height="13" rx="5" fill={c} {...s} />
        <path d="M44 34c0-5 6-5 6-10M60 34c0-5 6-5 6-10M76 34c0-5 6-5 6-10" fill="none" {...s} strokeWidth={2.5} />
      </>)
    case 'sacola':
      return (<>
        <path d="M30 46h60l6 52H24z" fill={c} {...s} />
        <path d="M44 56V38a16 16 0 0 1 32 0v18" fill="none" {...s} />
        <path d="M30 46h60l1 9H29z" fill="#fff" opacity=".45" />
      </>)
    case 'caixa':
      return (<>
        <path d="M26 46h68v48H26z" fill={c} {...s} />
        <path d="M26 46l10-16h48l10 16z" fill="#fff" {...s} />
        <path d="M60 30v30" {...s} />
        <rect x="48" y="68" width="24" height="12" rx="2" fill="#fff" {...s} strokeWidth={2} />
      </>)
    case 'rolo':
      return (<>
        <path d="M30 40v44c0 8 13 14 30 14s30-6 30-14V40" fill="#fff" {...s} />
        <ellipse cx="60" cy="40" rx="30" ry="14" fill={c} {...s} />
        <ellipse cx="60" cy="40" rx="10" ry="5" fill="#fff" {...s} strokeWidth={2} />
      </>)
    case 'garrafa':
      return (<>
        <rect x="52" y="16" width="16" height="9" rx="2" fill={c} {...s} />
        <path d="M54 25h12v8c0 6 10 9 10 20v40a6 6 0 0 1-6 6H50a6 6 0 0 1-6-6V53c0-11 10-14 10-20z" fill="#fff" {...s} />
        <path d="M44 60h32v20H44z" fill={c} {...s} />
        <path d="M44 88c8 4 24 4 32 0v5a6 6 0 0 1-6 6H50a6 6 0 0 1-6-6z" fill={c} opacity=".25" />
      </>)
    case 'galao':
      return (<>
        <rect x="50" y="14" width="20" height="10" rx="2" fill={c} {...s} />
        <path d="M52 24h16l4 10c12 3 16 8 16 16v42a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8V50c0-8 4-13 16-16z" fill={c} opacity=".3" />
        <path d="M52 24h16l4 10c12 3 16 8 16 16v42a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8V50c0-8 4-13 16-16z" fill="none" {...s} />
        <path d="M32 58h56M32 76h56" {...s} strokeWidth={2.5} />
        <path d="M32 62c10 5 18-5 28 0s18 5 28 0v30a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8z" fill={c} opacity=".5" />
      </>)
    case 'lata':
      return (<>
        <path d="M40 30c0-10 40-10 40 0v60c0 10-40 10-40 0z" fill={c} {...s} />
        <ellipse cx="60" cy="30" rx="20" ry="7" fill="#fff" {...s} />
        <path d="M40 50c0 8 40 8 40 0v18c0 8-40 8-40 0z" fill="#fff" opacity=".55" />
        <ellipse cx="60" cy="30" rx="6" ry="2.5" fill={TRACO} />
      </>)
    case 'pet':
      return (<>
        <rect x="52" y="12" width="16" height="9" rx="2" fill="#fff" {...s} />
        <path d="M54 21h12c0 12 12 14 12 28v46a6 6 0 0 1-6 6H48a6 6 0 0 1-6-6V49c0-14 12-16 12-28z" fill={c} {...s} />
        <path d="M42 56h36v22H42z" fill="#fff" {...s} />
        <path d="M50 67h20" {...s} stroke={c} strokeWidth={5} />
      </>)
    case 'frasco':
      return (<>
        <path d="M50 14h20v10H50z" fill={TRACO} {...s} />
        <path d="M52 24h16v8l12 12v50a6 6 0 0 1-6 6H46a6 6 0 0 1-6-6V44l12-12z" fill={c} {...s} />
        <rect x="46" y="54" width="28" height="26" rx="3" fill="#fff" {...s} strokeWidth={2.5} />
        <path d="M52 63h16M52 71h10" {...s} strokeWidth={2.5} />
      </>)
    case 'saco':
      return (<>
        <path d="M34 30h52l8 62a8 8 0 0 1-8 8H34a8 8 0 0 1-8-8z" fill={c} {...s} />
        <path d="M34 30l6-12h40l6 12" fill="#fff" {...s} />
        <rect x="42" y="50" width="36" height="28" rx="3" fill="#fff" opacity=".85" />
        <path d="M49 60h22M49 69h14" {...s} strokeWidth={2.5} />
      </>)
    case 'gelo':
      return (<>
        <path d="M24 56l22-10 22 10v26L46 92 24 82z" fill="#fff" {...s} />
        <path d="M24 56l22 10 22-10M46 66v26" fill="none" {...s} strokeWidth={2.5} />
        <path d="M24 56l22 10v26L24 82z" fill={c} opacity=".45" />
        <path d="M62 34l18-8 18 8v22L80 64l-12-5V56L62 53z" fill={c} opacity=".3" />
        <path d="M62 34l18-8 18 8v22L80 64l-12-5M62 34l18 8 18-8M80 42v22M62 34v19" fill="none" {...s} strokeWidth={2.5} />
      </>)
    case 'fosforo':
      return (<>
        <rect x="20" y="52" width="80" height="40" rx="4" fill={c} {...s} />
        <rect x="20" y="52" width="80" height="12" fill={TRACO} opacity=".85" />
        <path d="M40 46L62 20M56 46l22-26M72 46l22-26" {...s} stroke="#c9a36a" strokeWidth={4} />
        <circle cx="62" cy="20" r="4.5" fill={TRACO} /><circle cx="78" cy="20" r="4.5" fill={TRACO} /><circle cx="94" cy="20" r="4.5" fill={TRACO} />
      </>)
  }
}

export const ARTES: { id: Arte; nome: string }[] = [
  { id: 'copo', nome: 'Copo' }, { id: 'prato', nome: 'Prato' }, { id: 'talher', nome: 'Talher' },
  { id: 'marmita', nome: 'Marmita/pote' }, { id: 'sacola', nome: 'Sacola' }, { id: 'caixa', nome: 'Caixa' },
  { id: 'rolo', nome: 'Rolo' }, { id: 'garrafa', nome: 'Garrafa' }, { id: 'galao', nome: 'Galão' },
  { id: 'lata', nome: 'Lata' }, { id: 'pet', nome: 'Garrafa 2 L' }, { id: 'frasco', nome: 'Frasco' },
  { id: 'saco', nome: 'Saco' }, { id: 'gelo', nome: 'Gelo' }, { id: 'fosforo', nome: 'Fósforo' },
]

interface Props {
  arte: Arte
  cor?: string
  imagemUrl?: string
  nome?: string
  className?: string
}

export function ArteProduto({ arte, cor = '#00a9e8', imagemUrl, nome, className = '' }: Props) {
  if (imagemUrl) {
    return <img src={imagemUrl} alt={nome ?? ''} loading="lazy" className={`bg-white object-contain ${className}`} />
  }
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label={nome ? `Ilustração: ${nome}` : undefined} aria-hidden={nome ? undefined : true}
      className={className} style={{ background: `color-mix(in srgb, ${cor} 13%, #f3f5f7)` }}>
      <ellipse cx="60" cy="104" rx="34" ry="5" fill="#2b3036" opacity=".1" />
      {desenho(arte, cor)}
    </svg>
  )
}
