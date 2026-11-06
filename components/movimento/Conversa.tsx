'use client'

import { Fragment, useEffect, useRef } from 'react'
import { comoFunciona, site } from '@/content/lp'

/**
 * Conversa de WhatsApp que se escreve sozinha num celular e conduz os três
 * passos ao lado. Portada da seção `conversa` do proposta-kit e ampliada aqui.
 *
 * O roteiro, a cada volta:
 * 1. a etiqueta do passo aparece no meio da conversa (como as etiquetas de
 *    data do WhatsApp) e o passo correspondente acende na lista ao lado;
 * 2. a mensagem do paciente é digitada na barra de baixo e enviada;
 * 3. a clínica aparece "digitando…" e responde; os tiques do paciente ficam
 *    azuis, de lida.
 * Depois de uma pausa, recomeça.
 *
 * No celular os passos ficam acima do aparelho, fora da tela; as etiquetas
 * dentro da conversa é que fazem a ligação. No desktop os dois aparecem lado a
 * lado e a linha do tempo dos passos avança junto com a conversa.
 *
 * As mensagens vivem em `content/lp.ts` (`comoFunciona.conversa`) e só dizem o
 * que a clínica publica. A legenda deixa claro que é uma conversa ilustrativa.
 *
 * Sem JavaScript ou com movimento reduzido, a conversa aparece inteira e
 * parada, com as etiquetas. Toda ela sai do leitor de tela, que já leu os
 * passos ao lado.
 */
const conversa = comoFunciona.conversa
const passos = comoFunciona.passos

/** Mensagem que inaugura um passo: é antes dela que entra a etiqueta. */
const abrePasso = (i: number) => i === 0 || conversa[i - 1].passo !== conversa[i].passo

export function Conversa({ className = '' }: { className?: string }) {
  const lista = useRef<HTMLOListElement>(null)
  const campo = useRef<HTMLSpanElement>(null)
  const entrada = useRef<HTMLDivElement>(null)
  const digitando = useRef<HTMLLIElement>(null)
  const status = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ol = lista.current
    const texto = campo.current
    const barra = entrada.current
    if (!ol || !texto || !barra) return

    const pecas = ([...ol.children] as HTMLElement[]).filter((p) => p !== digitando.current)
    const etiquetas = pecas.filter((p) => p.dataset.etiqueta !== undefined)
    const msgs = pecas.filter((p) => p.dataset.msg !== undefined)
    const passosDom = [
      ...(ol.closest('section')?.querySelectorAll<HTMLElement>('[data-passo]') ?? []),
    ]
    const listaPassos = passosDom[0]?.parentElement

    const mostrarTudo = () => {
      pecas.forEach((p) => p.classList.add('on'))
      msgs.forEach((m) => m.classList.add('is-lida'))
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      mostrarTudo()
      return
    }

    /** Passo em curso: os anteriores ficam feitos, os seguintes, à espera. */
    const marcarPasso = (atual: number) => {
      passosDom.forEach((p, i) => {
        p.classList.toggle('is-ativo', i === atual)
        p.classList.toggle('is-feito', i < atual)
      })
    }

    let visivel = false
    let rodando = false
    let vivo = true
    let volta = 0
    const espera = (ms: number) => new Promise((r) => setTimeout(r, ms))
    const segue = (minhaVolta: number) => vivo && minhaVolta === volta

    const zerar = () => {
      pecas.forEach((p) => p.classList.remove('on', 'is-lida'))
      texto.textContent = ''
      barra.classList.remove('is-escrevendo')
      digitando.current?.classList.remove('on')
      if (status.current) status.current.textContent = 'online'
    }

    const rodar = async () => {
      rodando = true
      listaPassos?.classList.add('is-demo')
      while (visivel && vivo && !document.hidden) {
        const minhaVolta = ++volta
        zerar()
        marcarPasso(-1)
        await espera(350)
        for (let i = 0; i < msgs.length; i++) {
          if (!segue(minhaVolta)) return
          const m = msgs[i]
          const passo = conversa[i].passo
          if (abrePasso(i)) {
            etiquetas.find((e) => Number(e.dataset.etiqueta) === passo)?.classList.add('on')
            marcarPasso(passo)
            await espera(i === 0 ? 250 : 600)
          }

          if (conversa[i].de === 'paciente') {
            // Digitada na barra, letra a letra, e enviada.
            barra.classList.add('is-escrevendo')
            const frase = conversa[i].texto
            for (let k = 1; k <= frase.length; k++) {
              if (!segue(minhaVolta)) return
              texto.textContent = frase.slice(0, k)
              // Frase maior que a barra: mostra o fim, como no WhatsApp.
              if (texto.parentElement) texto.parentElement.scrollLeft = 9999
              await espera(frase[k - 1] === ' ' ? 34 : 18)
            }
            await espera(320)
            barra.classList.add('is-enviando')
            texto.textContent = ''
            if (texto.parentElement) texto.parentElement.scrollLeft = 0
            barra.classList.remove('is-escrevendo')
            m.classList.add('on')
            await espera(260)
            barra.classList.remove('is-enviando')
            await espera(500)
          } else {
            // A clínica lê (tiques azuis), digita e responde.
            msgs.slice(0, i).forEach((anterior) => anterior.classList.add('is-lida'))
            digitando.current?.classList.add('on')
            if (status.current) status.current.textContent = 'digitando…'
            await espera(1400)
            if (!segue(minhaVolta)) return
            digitando.current?.classList.remove('on')
            if (status.current) status.current.textContent = 'online'
            m.classList.add('on')
            await espera(900)
          }
        }
        marcarPasso(passos.length)
        await espera(6000)
      }
      rodando = false
    }

    const io = new IntersectionObserver(
      ([e]) => {
        visivel = e.isIntersecting
        if (visivel && !rodando) rodar()
      },
      { threshold: 0.15 },
    )
    io.observe(ol)
    const aoVoltar = () => {
      if (!document.hidden && visivel && !rodando) rodar()
    }
    document.addEventListener('visibilitychange', aoVoltar)
    return () => {
      vivo = false
      io.disconnect()
      document.removeEventListener('visibilitychange', aoVoltar)
      listaPassos?.classList.remove('is-demo')
    }
  }, [])

  return (
    <figure
      className={`conversa ${className}`}
      data-reveal
      style={{ '--d': '140ms' } as React.CSSProperties}
    >
      <div className="celular" aria-hidden>
        <div className="celular__topo">
          <span className="celular__avatar">
            <svg viewBox="0 0 24 24" aria-hidden focusable="false">
              <path d="M10 5h4v5h5v4h-5v5h-4v-5H5v-4h5z" fill="currentColor" />
            </svg>
          </span>
          <span className="celular__quem">
            <span className="celular__nome">{site.nome}</span>
            <span className="celular__status" ref={status}>
              online
            </span>
          </span>
        </div>

        <ol className="celular__msgs" ref={lista}>
          {conversa.map((m, i) => (
            <Fragment key={m.texto}>
              {abrePasso(i) && (
                <li className="etiqueta" data-etiqueta={m.passo}>
                  <span className="etiqueta__n">{m.passo + 1}</span>
                  {passos[m.passo].titulo}
                </li>
              )}
              <li className={`msg msg--${m.de}`} data-msg="">
                {m.texto}
                <span className="msg__hora">
                  {m.hora}
                  {m.de === 'paciente' && (
                    <svg className="msg__tiques" viewBox="0 0 18 11" focusable="false">
                      <path d="M1 5.8l3 3L11 1.6M7.6 7.4l1.4 1.4L16.4 1.6" />
                    </svg>
                  )}
                </span>
              </li>
            </Fragment>
          ))}
          <li className="celular__digitando" ref={digitando}>
            <span />
            <span />
            <span />
          </li>
        </ol>

        <div className="celular__entrada" ref={entrada}>
          <span className="celular__campo">
            <span className="celular__texto" ref={campo} />
            <span className="celular__cursor" />
            <span className="celular__dica">{comoFunciona.conversaCampo}</span>
          </span>
          <span className="celular__enviar">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M4 12.5 20 4l-5.5 16-3-6.5z" fill="currentColor" />
            </svg>
          </span>
        </div>
      </div>
      <figcaption className="conversa__legenda">{comoFunciona.conversaLegenda}</figcaption>
    </figure>
  )
}
