import { Reveal } from '@/components/ui/Reveal'
import { RichText } from '@/components/ui/RichText'
import { IconeMarca } from '@/components/ui/icons'
import { aClinica, site } from '@/content/lp'

/**
 * A prova de que "tudo num endereço só" é estrutura e não slogan: a lista é o
 * que a clínica tem instalado.
 *
 * Os responsáveis técnicos ficam aqui, com registro no conselho, porque num
 * site de saúde esse é o dado que separa clínica de improviso — e no site atual
 * ele está escondido em letra miúda no rodapé.
 */
export function AClinica() {
  return (
    <section className="secao secao--vinho" id="a-clinica">
      <div className="wrap clinica__grade">
        <Reveal>
          <p className="rotulo">{aClinica.eyebrow}</p>
          <h2 className="h2">{aClinica.titulo}</h2>
          <p className="lead">
            <RichText text={aClinica.texto} />
          </p>
        </Reveal>

        {/* A lista e o quadro dos responsáveis dividem a coluna da direita: com
            o quadro embaixo do texto, a direita ficava vazia da metade para o pé. */}
        <Reveal delay={120}>
          <ul className="clinica__lista">
            {aClinica.itens.map((item) => (
              <li className="clinica__item" key={item}>
                <IconeMarca className="clinica__marca" />
                {item}
              </li>
            ))}
          </ul>

          <div className="rt">
            <p className="rt__titulo">{aClinica.responsaveisTitulo}</p>
            <div className="rt__lista">
              {site.responsaveis.map((r) => (
                <p className="rt__item" key={r.registro}>
                  {r.nome}
                  <span className="rt__reg">{r.registro}</span>
                </p>
              ))}
            </div>
            <p className="rt__nota">{aClinica.responsaveisNota}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
