import { Reveal } from '@/components/ui/Reveal'
import { RichText } from '@/components/ui/RichText'
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
        <Reveal>
          <p className="rotulo">{semPlano.eyebrow}</p>
          <h2 className="h2">{semPlano.titulo}</h2>
          <p className="lead">
            <RichText text={semPlano.texto} />
          </p>
        </Reveal>

        <div className="semplano__pontos">
          {semPlano.pontos.map((ponto, i) => (
            <Reveal className="semplano__ponto" key={ponto.titulo} delay={i * 90}>
              <h3 className="semplano__pontoTitulo">{ponto.titulo}</h3>
              <p className="semplano__pontoTexto">{ponto.texto}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
