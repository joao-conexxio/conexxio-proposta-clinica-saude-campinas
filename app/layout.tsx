import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { buildJsonLd } from '@/content/schema'
import { GTM_ID, SITE_OFICIAL, site } from '@/content/lp'
import './globals.css'

/**
 * Uma família só, como pede o guia de identidade (sans serif, sem misturar
 * famílias, hierarquia por peso, tamanho e espaçamento). Figtree tem desenho
 * limpo e contemporâneo, com abertura generosa que segura bem o português em
 * corpo pequeno e no celular.
 *
 * Os três pesos do guia: Regular (texto de apoio), Semibold (subtítulos e
 * rótulos) e Bold (títulos e CTA), num arquivo variável só (400 a 700).
 *
 * O arquivo mora no projeto (`app/fonts/`, licença OFL ao lado) em vez de vir
 * do Google Fonts: assim o build não depende de rede e nada é pedido a
 * fonts.googleapis, que bloquearia a renderização do H1. Subconjunto latin,
 * que cobre todo o português.
 */
const fonte = localFont({
  src: './fonts/Figtree-latin.woff2',
  weight: '400 700',
  variable: '--font-sans',
  display: 'swap',
})

const AZUL = '#1077AE'

export const metadata: Metadata = {
  metadataBase: new URL(site.origin),
  title: site.title,
  description: site.description,
  alternates: { canonical: site.url },
  /**
   * Em modo proposta a página fica fora do Google: duas páginas com o mesmo
   * conteúdo competindo com o site atual da clínica a prejudicariam. No site
   * oficial (NEXT_PUBLIC_SITE_OFICIAL=true) a indexação é liberada. O
   * `robots.txt`, gerado em `app/robots.ts`, segue a mesma regra.
   */
  robots: SITE_OFICIAL
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: site.nome,
    url: site.url,
    title: site.title,
    description: site.ogDescription,
  },
  icons: {
    // Provisório até o símbolo oficial chegar em vetor: quadrado no Azul Pró
    // Clínica com uma cruz branca. Não reproduz o logotipo, que o guia proíbe
    // remontar. Inline: zero requisições.
    icon: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='${encodeURIComponent(AZUL)}'/%3E%3Cpath d='M13.5 8h5v5.5H24v5h-5.5V24h-5v-5.5H8v-5h5.5z' fill='%23fff'/%3E%3C/svg%3E`,
  },
  other: {
    'geo.region': 'BR-SP',
    'geo.placename': site.cidade,
  },
}

export const viewport: Viewport = {
  themeColor: AZUL,
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: o script abaixo acrescenta `js` ao <html> antes
    // da hidratação, então o className do cliente diverge do que veio do build.
    // É a divergência esperada — sem isto o React registra erro a cada carga.
    <html lang="pt-BR" className={fonte.variable} suppressHydrationWarning>
      <head>
        {/* Marca o documento como "tem JS" antes da primeira pintura. A entrada
            animada do hero está atrás de `.js`, então sem JavaScript a página
            nasce visível em vez de ficar em branco. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        {GTM_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(GTM_ID)});`,
            }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
        />
      </head>
      <body>
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(GTM_ID)}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
              title="Google Tag Manager"
            />
          </noscript>
        )}
        {children}
      </body>
    </html>
  )
}
