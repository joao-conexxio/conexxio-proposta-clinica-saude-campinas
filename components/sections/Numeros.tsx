import { Counter } from '@/components/ui/Counter'
import { Reveal } from '@/components/ui/Reveal'
import { numeros } from '@/content/lp'

/**
 * Os quatro números que a clínica já publica, reunidos. No site atual eles estão
 * soltos no meio de parágrafos corridos, e o mais forte deles — o prazo de 15
 * dias — está no oitavo parágrafo de um bloco de texto.
 *
 * O valor final vai no HTML estático; a contagem é enfeite por cima.
 */
export function Numeros() {
  return (
    <section className="secao--vinho numeros">
      <div className="wrap">
        <p className="rotulo">{numeros.label}</p>

        <Reveal className="numeros__grade">
          {numeros.itens.map((item) => (
            <div className="numeros__item" key={item.legenda}>
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
        </Reveal>
      </div>
    </section>
  )
}
