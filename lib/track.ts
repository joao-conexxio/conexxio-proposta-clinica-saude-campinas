/**
 * Camada única de telemetria da página.
 *
 * Todo evento sai por aqui e é entregue a quem estiver carregado: GA4 (gtag),
 * GTM (dataLayer), Meta (fbq) e Clarity. Nenhum deles é obrigatório: sem as
 * variáveis de ambiente configuradas, estas funções não fazem nada e a página
 * segue igual.
 *
 * O funil desta LP tem três degraus, e é a comparação entre eles que diz onde
 * o anúncio está perdendo gente:
 *
 *   1. `page_view`        chegou na página
 *   2. `funil_explicacao` rolou até "O que acontece depois"
 *   3. `cta_click`        clicou para abrir o WhatsApp
 *
 * Existe um quarto degrau que NENHUMA analytics de site enxerga: depois do
 * clique, a pessoa cai no WhatsApp com a mensagem pronta e ainda precisa tocar
 * em enviar. Muita gente não toca. A diferença entre `cta_click` e conversas
 * que realmente chegam só dá para medir comparando este número com o WhatsApp.
 */
type Win = Window & {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
  fbq?: (...args: unknown[]) => void
  clarity?: (...args: unknown[]) => void
}

function emitir(evento: string, dados: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  const w = window as Win

  // `typeof === 'function'` e não só `?.`: um <script> ou qualquer elemento com
  // id igual a "gtag"/"clarity" vira propriedade global e passaria no teste de
  // existência, fazendo a chamada estourar TypeError. Como isto roda dentro de
  // um IntersectionObserver, a exceção abortaria o resto do handler em silêncio.
  if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event: evento, ...dados })
  if (typeof w.gtag === 'function') w.gtag('event', evento, dados)
  // Clarity não recebe parâmetros: marca a sessão com uma etiqueta, o que
  // permite filtrar as gravações por comportamento depois.
  if (typeof w.clarity === 'function') w.clarity('event', evento)
}

/** Clique em qualquer CTA. `id` identifica QUAL botão, para comparar posições. */
export function trackCta(id: string) {
  emitir('cta_click', { cta_id: id })
  if (typeof window === 'undefined') return
  const w = window as Win
  // Meta usa um nome de evento próprio para conversão.
  if (typeof w.fbq === 'function') w.fbq('track', 'Lead', { content_name: id })
}

/** Profundidade de rolagem, uma vez por marco. */
export function trackScroll(pct: number) {
  emitir('scroll_depth', { percent: pct })
}

/** A pessoa chegou a ver uma seção. Usado para medir o degrau do meio. */
export function trackSecao(id: string) {
  emitir('secao_vista', { secao: id })
  if (id === 'o-que-acontece') emitir('funil_explicacao')
}
