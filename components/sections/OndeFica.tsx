import { FundoVivo } from '@/components/movimento/FundoVivo'
import { Mapa } from '@/components/movimento/Mapa'
import { CtaLink } from '@/components/ui/CtaLink'
import { IconeSeta, IconeWhatsapp } from '@/components/ui/icons'
import { ondeFica, site, waGeral } from '@/content/lp'

/**
 * Fechamento: onde fica de um lado, o pedido do outro.
 *
 * O site atual não tem mapa nem link para o Maps em nenhuma página, então quem
 * quer saber se dá para ir a pé precisa copiar o endereço na mão. Aqui o
 * endereço vem num cartão com o mapa desenhado do Centro, e o cartão inteiro
 * é o link para o Google Maps (alvo de toque grande no celular).
 *
 * O crédito do OpenStreetMap, exigido pela licença dos dados das ruas, fica
 * logo abaixo do cartão, fora do link.
 */
export function OndeFica() {
  return (
    <section className="secao secao--nevoa" id="onde-fica">
      <div className="wrap onde__grade">
        <div className="endereco" data-reveal>
          <h2 className="h2">{ondeFica.titulo}</h2>
          <p className="endereco__texto">{ondeFica.texto}</p>

          <a
            className="local"
            href={site.mapaHref}
            target="_blank"
            rel="noopener"
            aria-label={`${ondeFica.mapaRotulo}: ${site.endereco}, ${site.bairro}, ${site.cidade}, ${site.uf}`}
          >
            <Mapa />
            <span className="local__ficha">
              <span className="local__dados">
                <span className="endereco__rotulo">Endereço</span>
                <span className="endereco__rua">{site.endereco}</span>
                <span className="endereco__cidade">
                  {site.bairro}, {site.cidade}, {site.uf}
                </span>
              </span>
              <span className="local__abrir">
                {ondeFica.mapaRotuloCurto}
                <IconeSeta className="local__seta" />
              </span>
            </span>
          </a>
          <p className="local__credito">
            Mapa:{' '}
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">
              © colaboradores do OpenStreetMap
            </a>
          </p>
        </div>

        <div className="fechamento vivo-azul" data-reveal>
          <FundoVivo />
          <div className="fechamento__conteudo">
            <h2 className="fechamento__titulo">{ondeFica.cta.titulo}</h2>
            <p className="fechamento__texto">{ondeFica.cta.texto}</p>

            <div className="fechamento__acoes" data-cta-zona>
              <CtaLink className="btn fechamento__btn" href={waGeral} cta="fechamento" external>
                <IconeWhatsapp className="btn__zap" />
                {ondeFica.cta.botao}
              </CtaLink>
              <a className="fechamento__tel" href={site.telefoneHref}>
                {ondeFica.cta.telefoneRotulo} <strong>{site.telefone}</strong>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
