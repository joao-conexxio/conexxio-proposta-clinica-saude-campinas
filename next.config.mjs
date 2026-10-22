/**
 * O site é publicado como HTML estático. `output: 'export'` gera uma pasta `out/`
 * que sobe em qualquer hospedagem: Hostinger, Locaweb, cPanel, Netlify, Vercel,
 * GitHub Pages ou um subdiretório de um WordPress.
 *
 * NEXT_PUBLIC_BASE_PATH controla o subdiretório. O padrão é a raiz do domínio,
 * que é o caso comum de quem hospeda o site oficial.
 *
 *   npm run build                                          → raiz (clinica.com.br/)
 *   NEXT_PUBLIC_BASE_PATH=/site npm run build              → clinica.com.br/site/
 *
 * Todas as variáveis estão descritas no README e em `.env.example`.
 */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/+$/, '')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  reactStrictMode: true,
  // `output: 'export'` não tem servidor para otimizar imagens sob demanda.
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
}

export default nextConfig
