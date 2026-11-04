import type { CSSProperties } from 'react'
import { Acende } from '@/components/movimento/Texto'
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
    <section className="secao secao--azul" id="a-clinica">
      <div className="wrap clinica__grade">
        <div>
          <h2 className="h2" data-reveal>
            {aClinica.titulo}
          </h2>
          <p className="lead" data-acende>
            <Acende texto={aClinica.texto} />
          </p>
        </div>

        {/* A lista e o quadro dos responsáveis dividem a coluna da direita: com
            o quadro embaixo do texto, a direita ficava vazia da metade para o pé. */}
        <div>
          <ul className="clinica__lista">
            {aClinica.itens.map((item, i) => (
              <li
                className="clinica__item"
                key={item}
                data-reveal
                style={{ '--d': `${i * 90}ms` } as CSSProperties}
              >
                <IconeMarca className="clinica__marca" />
                {item}
              </li>
            ))}
          </ul>

          <div className="rt" data-reveal>
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
        </div>
      </div>
    </section>
  )
}
