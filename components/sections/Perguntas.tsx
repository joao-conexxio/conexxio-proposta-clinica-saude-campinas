'use client'

import { useState } from 'react'
import { RichText } from '@/components/ui/RichText'
import { faq } from '@/content/lp'

/**
 * Acordeão de perguntas. A primeira nasce aberta para o padrão ficar visível
 * sem exigir um clique de descoberta.
 *
 * Todas as respostas ficam no HTML estático mesmo quando fechadas — a altura é
 * animada por `grid-template-rows`, não por `display: none` — então buscador e
 * leitor de tela leem o conteúdo inteiro. O mesmo texto alimenta o FAQPage do
 * JSON-LD, gerado a partir desta lista.
 */
export function Perguntas() {
  const [aberta, setAberta] = useState<number | null>(0)

  return (
    <section className="secao" id="perguntas">
      <div className="wrap">
        <h2 className="h2" data-reveal>
          {faq.titulo}
        </h2>

        <div className="faq" data-reveal>
          {faq.itens.map((item, i) => {
            const abertaAqui = aberta === i
            return (
              <div className={`faq__item${abertaAqui ? ' is-aberto' : ''}`} key={item.q}>
                <h3>
                  <button
                    type="button"
                    id={`pergunta-${i}`}
                    className="faq__botao"
                    aria-expanded={abertaAqui}
                    aria-controls={`resposta-${i}`}
                    onClick={() => setAberta(abertaAqui ? null : i)}
                  >
                    {item.q}
                    <span className="faq__sinal" aria-hidden />
                  </button>
                </h3>
                <div
                  className="faq__resposta"
                  id={`resposta-${i}`}
                  role="region"
                  aria-labelledby={`pergunta-${i}`}
                >
                  <div className="faq__respostaInterna">
                    <p className="faq__respostaTexto">
                      <RichText text={item.a} />
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
