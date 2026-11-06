import type { CSSProperties } from 'react'
import { Formas } from '@/components/movimento/Formas'
import { Acende } from '@/components/movimento/Texto'
import { IconeSaude } from '@/components/ui/IconeSaude'
import { aClinica, site } from '@/content/lp'

/**
 * A prova de que "tudo num endereço só" é estrutura e não slogan: a lista é o
 * que a clínica tem instalado.
 *
 * Os responsáveis técnicos ficam aqui, com registro no conselho, porque num
 * site de saúde esse é o dado que separa clínica de improviso — e no site atual
 * ele está escondido em letra miúda no rodapé.
 *
 * As formas de fundo (as mesmas do topo, em branco) ocupam no desktop o vazio
 * embaixo do texto, o lugar que as fotos da clínica vão ocupar quando
 * chegarem. No celular elas ficam no canto do título, cortadas pela borda.
 */
export function AClinica() {
  return (
    <section className="secao secao--azul clinica" id="a-clinica">
      <div className="wrap clinica__grade">
        <div>
          <h2 className="h2" data-reveal>
            {aClinica.titulo}
          </h2>
          <p className="lead" data-acende>
            <Acende texto={aClinica.texto} />
          </p>
          <Formas className="formas--azul clinica__formas" paralaxe={0.08} />
        </div>

        {/* A lista e o quadro dos responsáveis dividem a coluna da direita: com
            o quadro embaixo do texto, a direita ficava vazia da metade para o pé. */}
        <div>
          <ul className="clinica__lista">
            {aClinica.itens.map((item, i) => (
              <li
                className="clinica__item"
                key={item.texto}
                data-reveal
                style={{ '--d': `${i * 90}ms` } as CSSProperties}
              >
                <span className="clinica__ico">
                  <IconeSaude nome={item.icone} />
                </span>
                {item.texto}
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
