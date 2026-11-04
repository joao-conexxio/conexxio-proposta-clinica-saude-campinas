import type { CSSProperties } from 'react'
import { Conversa } from '@/components/movimento/Conversa'
import { CtaLink } from '@/components/ui/CtaLink'
import { IconeWhatsapp } from '@/components/ui/icons'
import { comoFunciona, whatsapp } from '@/content/lp'

/**
 * Único lugar numerado da página, porque é a única coisa que realmente é
 * sequência. A promessa está no título: nenhum dos passos exige ir até lá antes
 * de ter data marcada.
 *
 * Ao lado, o celular com a conversa que se escreve sozinha mostra o passo 1
 * acontecendo: a mensagem chega com o assunto já escrito. No celular, ele vem
 * depois dos passos.
 */
export function ComoFunciona() {
  return (
    <section className="secao" id="como-funciona">
      <div className="wrap comoFunciona__grade">
        <div>
          <h2 className="h2" data-reveal>
            {comoFunciona.titulo}
          </h2>

          <ol className="passos">
            {comoFunciona.passos.map((passo, i) => (
              <li
                className="passo"
                key={passo.titulo}
                data-reveal
                style={{ '--d': `${i * 140}ms` } as CSSProperties}
              >
                <span className="passo__n" aria-hidden>
                  {i + 1}
                </span>
                <h3 className="passo__titulo">{passo.titulo}</h3>
                <p className="passo__texto">{passo.texto}</p>
              </li>
            ))}
          </ol>

          <div className="passos__cta" data-cta-zona>
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

        <Conversa />
      </div>
    </section>
  )
}
