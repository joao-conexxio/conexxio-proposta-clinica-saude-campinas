/**
 * A LP é publicada como HTML estático. `output: 'export'` gera uma pasta `out/`
 * que sobe tanto num subdiretório do WordPress quanto na raiz de um host estático.
 *
 * BASE_PATH controla o subdiretório. O canonical atual aponta para
 * conexxio.com.br/lps/empresa-de-ia/, então é esse o padrão em produção; em dev
 * fica vazio para o servidor local responder na raiz.
 *
 *   npm run build                                  → /lps/empresa-de-ia
 *   NEXT_PUBLIC_BASE_PATH= npm run build           → raiz
 */
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.NODE_ENV === 'production' ? '/lps/empresa-de-ia' : '')

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
