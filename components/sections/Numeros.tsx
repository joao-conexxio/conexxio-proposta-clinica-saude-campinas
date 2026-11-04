import type { CSSProperties } from 'react'
import { FundoVivo } from '@/components/movimento/FundoVivo'
import { Counter } from '@/components/ui/Counter'
import { numeros } from '@/content/lp'

/**
 * Os quatro números que a clínica já publica, reunidos. No site atual eles estão
 * soltos no meio de parágrafos corridos, e o mais forte deles — o prazo de 15
 * dias — está no oitavo parágrafo de um bloco de texto.
 *
 * O valor final vai no HTML estático; a contagem é enfeite por cima. Atrás, o
 * fundo vivo em azul: as manchas só escurecem o azul oficial, então o texto
 * branco nunca perde contraste.
 */
export function Numeros() {
  return (
    <section className="secao--azul numeros vivo-azul" aria-labelledby="numeros-titulo">
      <FundoVivo />
      <div className="wrap">
        <h2 className="numeros__titulo" id="numeros-titulo" data-reveal>
          {numeros.titulo}
        </h2>

        <div className="numeros__grade">
          {numeros.itens.map((item, i) => (
            <div
              className="numeros__item"
              key={item.legenda}
              data-reveal
              style={{ '--d': `${i * 110}ms` } as CSSProperties}
            >
              <Counter
                className="numeros__valor"
                count={item.count}
                prefix={'prefix' in item ? item.prefix : undefined}
                group={'group' in item ? item.group : undefined}
              >
                {item.display}
              </Counter>
              <span className="numeros__legenda">{item.legenda}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
