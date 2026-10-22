import { IconeFacebook, IconeInstagram } from '@/components/ui/icons'
import { asset } from '@/lib/asset'
import { footer, site } from '@/content/lp'

export function Footer() {
  return (
    <footer className="rodape">
      <div className="wrap">
        <div className="rodape__grade">
          <div className="rodape__marca">
            {/* Fundo claro e logo no arquivo original: o guia proíbe trocar as
                cores do logotipo, e fundo claro é a aplicação preferencial. */}
            <img
              src={asset(site.logo.src)}
              alt={site.nome}
              width={site.logo.largura}
              height={site.logo.altura}
            />
            <p className="rodape__descricao">{footer.descricao}</p>
          </div>

          {footer.colunas.map((coluna) => (
            <div key={coluna.titulo}>
              <h2 className="rodape__colTitulo">{coluna.titulo}</h2>
              <div className="rodape__links">
                {coluna.links.map((link) => (
                  <a key={link.label} href={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}

          <div>
            <h2 className="rodape__colTitulo">{footer.redesTitulo}</h2>
            <div className="rodape__redes">
              <a
                className="rodape__rede"
                href={site.instagram}
                target="_blank"
                rel="noopener"
                aria-label="Instagram da clínica"
              >
                <IconeInstagram />
              </a>
              <a
                className="rodape__rede"
                href={site.facebook}
                target="_blank"
                rel="noopener"
                aria-label="Facebook da clínica"
              >
                <IconeFacebook />
              </a>
            </div>

            <address className="rodape__contato">
              <a href={site.telefoneHref}>{site.telefone}</a>
              <span>
                {site.endereco}
                <br />
                {site.bairro}, {site.cidade}, {site.uf}
              </span>
            </address>
          </div>
        </div>

        <div className="rodape__base">
          <p className="rodape__rt">
            Responsáveis técnicos:{' '}
            {site.responsaveis.map((r, i) => (
              <span key={r.registro}>
                {i > 0 && ' e '}
                {r.nome} ({r.registro})
              </span>
            ))}
          </p>
          {/* Única menção ao autor da proposta em toda a página. */}
          <p className="rodape__assinatura">{footer.assinatura}</p>
          {footer.assinaturaNota && <p className="rodape__aviso">{footer.assinaturaNota}</p>}
        </div>
      </div>
    </footer>
  )
}
