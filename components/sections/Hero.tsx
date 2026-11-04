import type { CSSProperties } from 'react'
import { Ecg } from '@/components/movimento/Ecg'
import { FundoVivo } from '@/components/movimento/FundoVivo'
import { Palavras } from '@/components/movimento/Texto'
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
 * A abertura é o momento de maior movimento da página: o fundo vivo flui na
 * cor da marca e segue o ponteiro (ou o dedo), o título sobe palavra por
 * palavra, o resto entra em cascata e o traçado de eletro se desenha na base.
 * Tudo atrás de `.js` e parado sob movimento reduzido.
 */
const atraso = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties
export function Hero() {
  return (
    <section className="hero">
      <FundoVivo />
      <Ecg className="hero__ecg" batidas={9} />

      <div className="wrap hero__grade">
        <div className="hero__texto">
          <h1 className="hero__h1">
            <Palavras texto={hero.h1} />
          </h1>

          <p className="hero__lead hero__entra" style={atraso(520)}>
            <RichText text={hero.lead} />
          </p>

          <div className="hero__acoes hero__entra" style={atraso(660)} data-cta-zona>
            <CtaLink className="btn btn--acao" href={waGeral} cta="hero" external>
              <IconeWhatsapp className="btn__zap" />
              {hero.ctaPrimario}
            </CtaLink>
            <a className="btn btn--linha" href={QUADRO_HREF}>
              {hero.ctaSecundario}
            </a>
          </div>

          <p className="hero__nota hero__entra" style={atraso(800)}>
            <span className="hero__ponto" aria-hidden />
            Atendimento particular, sem plano de saúde
          </p>
        </div>

        <aside className="ficha hero__entra" style={atraso(380)} aria-label="Dados da clínica" data-tilt>
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
