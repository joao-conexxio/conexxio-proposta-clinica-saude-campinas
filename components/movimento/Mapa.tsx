import type { CSSProperties } from 'react'
import { mapa } from '@/content/mapa'

/**
 * Mapa desenhado do Centro de Campinas: as ruas reais em volta da clínica
 * (OpenStreetMap, gerado por `ferramentas/gerar-mapa.mjs`), em linhas finas,
 * no mesmo espírito do eletro e das formas de fundo. A R. Bernardino de
 * Campos vem no azul oficial e o pin fica no 927, no centro do desenho.
 *
 * Quando a seção chega na tela (`data-desenha`, ligado pelo `Movimento`), as
 * ruas se desenham de dentro para fora, a partir do pin. É SVG estático no
 * HTML: nenhuma requisição, nenhum script de mapa, nenhum cookie.
 *
 * O pin e a etiqueta são HTML por cima, no centro da caixa (o `slice` mantém o
 * centro do desenho no centro da caixa em qualquer proporção), para o texto
 * ter o mesmo tamanho no celular e no desktop.
 */
export function Mapa() {
  return (
    <div className="mapa" data-desenha>
      <svg
        className="mapa__svg"
        viewBox={mapa.caixa}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
        focusable="false"
      >
        <defs>
          {mapa.rotulos.map((r) => (
            <path key={r.id} id={r.id} d={r.d} />
          ))}
        </defs>
        <g className="mapa__areas">
          {mapa.areas.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <g className="mapa__vias">
          {mapa.vias.map((v, i) => (
            <path
              key={i}
              className={`via via--${v.c}`}
              d={v.d}
              pathLength={1}
              style={{ '--a': `${v.atraso}ms` } as CSSProperties}
            />
          ))}
        </g>
        <g className="mapa__destaque">
          {mapa.destaque.map((v, i) => (
            <path
              key={i}
              className="via via--destaque"
              d={v.d}
              pathLength={1}
              style={{ '--a': `${v.atraso}ms` } as CSSProperties}
            />
          ))}
        </g>
        <g className="mapa__rotulos">
          {mapa.rotulos.map((r) => (
            <text key={r.id} dy="-9">
              <textPath href={`#${r.id}`} startOffset={r.onde} textAnchor="middle">
                {r.texto}
              </textPath>
            </text>
          ))}
        </g>
      </svg>

      <span className="mapa__pin" aria-hidden>
        <span className="mapa__onda" />
        <span className="mapa__onda" />
        <span className="mapa__ponto">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M10 5h4v5h5v4h-5v5h-4v-5H5v-4h5z" fill="currentColor" />
          </svg>
        </span>
      </span>
    </div>
  )
}
