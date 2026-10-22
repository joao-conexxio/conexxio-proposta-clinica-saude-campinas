import { CtaLink } from '@/components/ui/CtaLink'
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
        <h2 className="h2">{comoFunciona.titulo}</h2>

        <ol className="passos">
          {comoFunciona.passos.map((passo, i) => (
            <li className="passo" key={passo.titulo}>
              <span className="passo__n" aria-hidden>
                {i + 1}
              </span>
              <h3 className="passo__titulo">{passo.titulo}</h3>
              <p className="passo__texto">{passo.texto}</p>
            </li>
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
