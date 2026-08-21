/**
 * Prefixa o basePath em URLs de arquivos servidos de `public/`.
 *
 * O Next resolve isso sozinho para next/image e para imports, mas não para um
 * `src` escrito à mão. Como a LP é publicada num subdiretório
 * (/lps/empresa-de-ia/), esquecer o prefixo dá 404 só em produção — o tipo de
 * bug que passa batido em dev e aparece depois do deploy.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export function asset(path: string): string {
  return `${BASE}${path}`
}
