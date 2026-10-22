import { CtaLink } from '@/components/ui/CtaLink'
import { IconeWhatsapp } from '@/components/ui/icons'
import { ondeFica, site, waGeral } from '@/content/lp'

/**
 * Fechamento: endereço de um lado, pedido do outro.
 *
 * O site atual não tem mapa nem link para o Maps em nenhuma página, então quem
 * quer saber se dá para ir a pé precisa copiar o endereço na mão. Aqui o link
 * abre o Maps já com a busca pronta.
 */
export function OndeFica() {
  return (
    <section className="secao secao--nevoa" id="onde-fica">
      <div className="wrap onde__grade">
        <div className="endereco">
          <h2 className="h2">{ondeFica.titulo}</h2>
          <p className="endereco__texto">{ondeFica.texto}</p>

          {/* O endereço volta como campo de ficha, a mesma linguagem do cartão
              do hero, em vez de um segundo título empilhado. */}
          <div className="endereco__campo">
            <span className="endereco__rotulo">Endereço</span>
            <p className="endereco__rua">{site.endereco}</p>
            <p className="endereco__cidade">
              {site.bairro}, {site.cidade}, {site.uf}
            </p>
          </div>

          <a
            className="btn btn--linha endereco__mapa"
            href={site.mapaHref}
            target="_blank"
            rel="noopener"
          >
            {ondeFica.mapaRotulo}
          </a>
        </div>

        <div className="fechamento">
          <div className="fechamento__conteudo">
            <h2 className="fechamento__titulo">{ondeFica.cta.titulo}</h2>
            <p className="fechamento__texto">{ondeFica.cta.texto}</p>

            <div className="fechamento__acoes" data-cta-zona>
              <CtaLink
                className="btn fechamento__btn"
                href={waGeral}
                cta="fechamento"
                external
              >
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
