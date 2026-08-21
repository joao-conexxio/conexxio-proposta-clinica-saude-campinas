import type { Metadata, Viewport } from 'next'
import { DM_Mono, Fraunces, Inter_Tight } from 'next/font/google'
import { buildJsonLd } from '@/content/schema'
import { site } from '@/content/lp'
import './globals.css'

/**
 * Três papéis, três famílias, auto-hospedadas pelo next/font — nada de
 * fonts.googleapis por <link>, que bloqueia a renderização do H1 (o elemento
 * de LCP desta página).
 *
 * Fraunces é uma serifada de terminais macios: a clínica vende acolhimento a
 * quem não tem plano, e uma grotesca de hospital diria o contrário. Inter Tight
 * segura o corpo em português, que tem palavras longas. DM Mono é a voz dos
 * rótulos, e é dela que vem o ar de ficha de atendimento.
 */
const display = Fraunces({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
})
const corpo = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-corpo',
  display: 'swap',
})
const mono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.origin),
  title: site.title,
  description: site.description,
  alternates: { canonical: site.url },
  /**
   * noindex/nofollow é obrigatório: esta é uma proposta, não o site oficial da
   * clínica. Duas páginas com o mesmo conteúdo e o mesmo endereço competindo no
   * Google prejudicariam o cliente. O `robots.txt` em `public/` reforça o mesmo.
   */
  robots: { index: false, follow: false, nocache: true },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: site.nome,
    url: site.url,
    title: site.title,
    description: site.ogDescription,
  },
  icons: {
    // O "S" da marca da clínica, redesenhado como duas elipses. Inline: zero requisições.
    icon:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%2359131B'/%3E%3Cg fill='none' stroke='%23FBF7F5' stroke-width='2.1' transform='rotate(-19 16 16)'%3E%3Cellipse cx='16' cy='12.4' rx='7.4' ry='4.1'/%3E%3Cellipse cx='16' cy='19.6' rx='7.4' ry='4.1'/%3E%3C/g%3E%3C/svg%3E",
  },
  other: {
    'geo.region': 'BR-SP',
    'geo.placename': site.cidade,
  },
}

export const viewport: Viewport = {
  themeColor: '#59131b',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: o script abaixo acrescenta `js` ao <html> antes
    // da hidratação, então o className do cliente diverge do que veio do build.
    // É a divergência esperada — sem isto o React registra erro a cada carga.
    <html
      lang="pt-BR"
      className={`${display.variable} ${corpo.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Marca o documento como "tem JS" antes da primeira pintura. Todo o CSS
            de reveal está atrás de `.js`, então sem JavaScript a página nasce
            visível em vez de ficar em branco. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
