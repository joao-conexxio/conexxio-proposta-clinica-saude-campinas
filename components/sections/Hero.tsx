import { CtaLink } from '@/components/ui/CtaLink'
import { RichText } from '@/components/ui/RichText'
import { IconeWhatsapp } from '@/components/ui/icons'
import { QUADRO_HREF, hero, site, waGeral } from '@/content/lp'

/**
 * O hero abre pela promessa concreta, não pela apresentação da clínica: quem
 * chega procurando atendimento quer saber se resolve tudo num lugar só e em
 * quanto tempo. O cartão de ficha ao lado responde as quatro perguntas
 * seguintes (onde, como falar, quanto custa o tipo de atendimento, e o prazo)
 * antes de a pessoa precisar rolar.
 *
 * É o único movimento automático da página: texto e cartão entram uma vez, no
 * carregamento (CSS, atrás de `.js` e desligado em movimento reduzido).
 */
export function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero__grade">
        <div className="hero__texto">
          <h1 className="hero__h1">{hero.h1}</h1>

          <p className="hero__lead">
            <RichText text={hero.lead} />
          </p>

          <div className="hero__acoes" data-cta-zona>
            <CtaLink className="btn btn--acao" href={waGeral} cta="hero" external>
              <IconeWhatsapp className="btn__zap" />
              {hero.ctaPrimario}
            </CtaLink>
            <a className="btn btn--linha" href={QUADRO_HREF}>
              {hero.ctaSecundario}
            </a>
          </div>

          <p className="hero__nota">
            <span className="hero__ponto" aria-hidden />
            Atendimento particular, sem plano de saúde
          </p>
        </div>

        <aside className="ficha" aria-label="Dados da clínica">
          <div className="ficha__topo">
            <span className="ficha__titulo">{hero.ficha.titulo}</span>
            <span className="ficha__cidade">
              {site.cidade}, {site.uf}
            </span>
          </div>

          <div className="ficha__linhas">
            {hero.ficha.linhas.map((linha) => (
              <div className="ficha__linha" key={linha.rotulo}>
                <span className="ficha__rotulo">{linha.rotulo}</span>
                <span className="ficha__valor">{linha.valor}</span>
              </div>
            ))}
          </div>

          <div className="ficha__rt">
            <p className="ficha__rtTitulo">{hero.ficha.responsaveisRotulo}</p>
            {site.responsaveis.map((r) => (
              <p className="ficha__rtItem" key={r.registro}>
                {r.nome} <span>{r.registro}</span>
              </p>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
