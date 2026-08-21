import { CtaLink } from '@/components/ui/CtaLink'
import { Reveal } from '@/components/ui/Reveal'
import { IconeWhatsapp } from '@/components/ui/icons'
import { comoFunciona, whatsapp } from '@/content/lp'

/**
 * Único lugar numerado da página, porque é a única coisa que realmente é
 * sequência. A promessa está no título: nenhum dos passos exige ir até lá antes
 * de ter data marcada.
 */
export function ComoFunciona() {
  return (
    <section className="secao" id="como-funciona">
      <div className="wrap">
        <Reveal>
          <p className="rotulo">{comoFunciona.eyebrow}</p>
          <h2 className="h2">{comoFunciona.titulo}</h2>
        </Reveal>

        <ol className="passos">
          {comoFunciona.passos.map((passo, i) => (
            <Reveal as="li" className="passo" key={passo.titulo} delay={i * 110}>
              <span className="passo__n">Passo {i + 1}</span>
              <h3 className="passo__titulo">{passo.titulo}</h3>
              <p className="passo__texto">{passo.texto}</p>
            </Reveal>
          ))}
        </ol>

        <div className="passos__cta">
          <CtaLink
            className="btn btn--acao"
            href={whatsapp(comoFunciona.ctaMensagem)}
            cta="como-funciona"
            external
          >
            <IconeWhatsapp className="btn__zap" />
            {comoFunciona.cta}
          </CtaLink>
        </div>
      </div>
    </section>
  )
}
