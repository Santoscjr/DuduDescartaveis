import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Base relativa: o mesmo build funciona em /DuduDescartaveis/ (GitHub Pages),
// em domínio próprio ou aberto localmente. As rotas usam hash (#/catalogo),
// então atualizar a página nunca gera 404 no Pages.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
})
