import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const base = (p: P) => ({
  width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, ...p,
})

export const IcBusca = (p: P) => <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
export const IcLista = (p: P) => <svg {...base(p)}><path d="M9 5h11M9 12h11M9 19h11" /><path d="m3.5 5 1 1 2-2M3.5 12l1 1 2-2M3.5 19l1 1 2-2" /></svg>
export const IcMais = (p: P) => <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>
export const IcMenos = (p: P) => <svg {...base(p)}><path d="M5 12h14" /></svg>
export const IcLixeira = (p: P) => <svg {...base(p)}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
export const IcFechar = (p: P) => <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>
export const IcMenu = (p: P) => <svg {...base(p)}><path d="M4 6h16M4 12h16M4 18h16" /></svg>
export const IcPin = (p: P) => <svg {...base(p)}><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.800 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
export const IcRelogio = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
export const IcCaminhao = (p: P) => <svg {...base(p)}><path d="M2 6h11v10H2zM13 9h5l3 4v3h-8z" /><circle cx="6.5" cy="17.500" r="2" /><circle cx="17" cy="17.500" r="2" /></svg>
export const IcLoja = (p: P) => <svg {...base(p)}><path d="M3 10 5 4h14l2 6M4 10v10h16V10M3 10h18M9 20v-6h6v6" /></svg>
export const IcPredio = (p: P) => <svg {...base(p)}><path d="M4 21V4h10v17M14 9h6v12M2 21h20M8 8h2M8 12h2M8 16h2M17 13h0M17 17h0" /></svg>
export const IcPessoa = (p: P) => <svg {...base(p)}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.400 3.600-7 8-7s8 2.600 8 7" /></svg>
export const IcRepetir = (p: P) => <svg {...base(p)}><path d="M4 12a8 8 0 0 1 13.700-5.600L20 8.500M20 4v4.500h-4.500M20 12a8 8 0 0 1-13.700 5.600L4 15.500M4 20v-4.500h4.500" /></svg>
export const IcSeta = (p: P) => <svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
export const IcCheck = (p: P) => <svg {...base(p)}><path d="m5 12.500 4.500 4.500L19 7.500" /></svg>
export const IcInfo = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.500v.01" /></svg>
export const IcEditar = (p: P) => <svg {...base(p)}><path d="M4 20h4L19 9l-4-4L4 16zM13.500 6.500l4 4" /></svg>
export const IcEstrela = (p: P) => <svg {...base(p)}><path d="m12 3 2.700 5.800 6.300.800-4.600 4.300 1.200 6.200L12 17l-5.600 3.100 1.200-6.200L3 9.600l6.300-.800z" /></svg>
export const IcCima = (p: P) => <svg {...base(p)}><path d="m6 15 6-6 6 6" /></svg>
export const IcBaixo = (p: P) => <svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>
export const IcGrafico = (p: P) => <svg {...base(p)}><path d="M4 20V10M10 20V4M16 20v-8M22 20H2" /></svg>
export const IcEngrenagem = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.900 4.900 7 7M17 17l2.100 2.100M19.100 4.900 17 7M7 17l-2.100 2.100" /></svg>
export const IcEtiqueta = (p: P) => <svg {...base(p)}><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.500" cy="8.500" r="1.500" /></svg>
export const IcCaixa = (p: P) => <svg {...base(p)}><path d="M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8" /></svg>
export const IcInstagram = (p: P) => <svg {...base(p)}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.500 6.500v.01" /></svg>

export const IcWhatsapp = (p: P) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M12 2a10 10 0 0 0-8.600 15.100L2 22l5-1.300A10 10 0 1 0 12 2zm0 18.200a8.200 8.200 0 0 1-4.200-1.150l-.300-.180-3 .790.800-2.900-.200-.300A8.200 8.200 0 1 1 12 20.200zm4.500-6.100c-.250-.120-1.460-.720-1.690-.800s-.390-.120-.560.120-.640.800-.790.970-.290.180-.540.060a6.700 6.700 0 0 1-2-1.220 7.400 7.400 0 0 1-1.370-1.700c-.140-.250 0-.380.110-.500s.250-.290.370-.430a1.700 1.700 0 0 0 .250-.420.460.460 0 0 0 0-.430c-.060-.120-.560-1.340-.760-1.840s-.400-.420-.560-.430h-.470a.900.900 0 0 0-.660.310 2.800 2.800 0 0 0-.860 2.050 4.800 4.800 0 0 0 1 2.540 11 11 0 0 0 4.200 3.700c.590.250 1 .400 1.400.510a3.400 3.400 0 0 0 1.550.100 2.500 2.500 0 0 0 1.660-1.170 2 2 0 0 0 .140-1.170c-.060-.100-.220-.160-.470-.280z" />
  </svg>
)
