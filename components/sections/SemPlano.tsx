import type { CSSProperties } from 'react'
import { Acende } from '@/components/movimento/Texto'
import { semPlano } from '@/content/lp'

/**
 * Substitui o "Quem somos?" do site atual, que hoje é a primeira coisa depois do
 * hero e são dez parágrafos corridos sem hierarquia. Aqui a mesma informação
 * vira uma afirmação e três razões, cada uma nomeando o que a pessoa NÃO vai
 * precisar fazer.
 */
export function SemPlano() {
  return (
    <section className="secao" id="sem-plano">
      <div className="wrap semplano__grade">
        <div>
          <h2 className="h2" data-reveal>
            {semPlano.titulo}
          </h2>
          {/* Acende palavra por palavra conforme a rolagem: é o argumento
              central da página, lido no ritmo de quem rola. */}
          <p className="lead semplano__lead" data-acende>
            <Acende texto={semPlano.texto} />
          </p>
        </div>

        <div className="semplano__pontos">
          {semPlano.pontos.map((ponto, i) => (
            <div
              className="semplano__ponto"
              key={ponto.titulo}
              data-reveal
              style={{ '--d': `${i * 120}ms` } as CSSProperties}
            >
              <h3 className="semplano__pontoTitulo">{ponto.titulo}</h3>
              <p className="semplano__pontoTexto">{ponto.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
