// Assinatura tipográfica provisória, inspirada na fachada (nome em branco, detalhe azul, copo).
// Não é o logotipo oficial: deve ser trocada pelo arquivo da marca quando a loja fornecer.
export function Logo({ claro = true, compacto = false }: { claro?: boolean; compacto?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="DUDU Descartáveis">
      <svg viewBox="0 0 40 44" className={compacto ? 'h-8 w-auto' : 'h-10 w-auto'} aria-hidden>
        <path d="M6 6h28l-4 32a4 4 0 0 1-4 3.500H14a4 4 0 0 1-4-3.500z" fill={claro ? '#fff' : '#2b3036'} />
        <path d="M7.500 17h25l-1.200 10H8.700z" fill="#00a9e8" />
        <path d="M4 6h32" stroke="#00a9e8" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`font-display font-bold tracking-wide ${compacto ? 'text-2xl' : 'text-3xl'} ${claro ? 'text-white' : 'text-grafite-900'}`}>DUDU</span>
        <span className="font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-dudu-500">Descartáveis</span>
      </span>
    </span>
  )
}
