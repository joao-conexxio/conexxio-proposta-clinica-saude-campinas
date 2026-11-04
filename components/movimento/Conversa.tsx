'use client'

import { useEffect, useRef } from 'react'
import { comoFunciona, site } from '@/content/lp'

/**
 * Conversa de WhatsApp que se escreve sozinha num celular enquanto está na
 * tela: a pessoa manda a mensagem que o botão do site já deixa pronta, a
 * clínica "digita" e responde. Recomeça depois de uma pausa. Portado da seção
 * `conversa` do proposta-kit.
 *
 * As mensagens vivem em `content/lp.ts` (`comoFunciona.conversa`) e só dizem o
 * que a clínica publica. A legenda deixa claro que é uma conversa ilustrativa.
 *
 * Sem JavaScript ou com movimento reduzido, a conversa aparece inteira e
 * parada. Toda a conversa sai do leitor de tela, que já leu os passos ao lado.
 */
export function Conversa() {
  const lista = useRef<HTMLOListElement>(null)
  const digitando = useRef<HTMLDivElement>(null)
  const status = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ol = lista.current
    if (!ol) return
    const msgs = [...ol.children] as HTMLElement[]
    const mostrarTudo = () => msgs.forEach((m) => m.classList.add('on'))

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      mostrarTudo()
      return
    }

    let visivel = false
    let rodando = false
    let vivo = true
    const espera = (ms: number) => new Promise((r) => setTimeout(r, ms))

    const rodar = async () => {
      rodando = true
      while (visivel && vivo && !document.hidden) {
        msgs.forEach((m) => m.classList.remove('on'))
        await espera(700)
        for (const m of msgs) {
          if (!vivo) return
          if (m.classList.contains('msg--clinica')) {
            digitando.current?.classList.add('on')
            if (status.current) status.current.textContent = 'digitando…'
            await espera(1400)
            digitando.current?.classList.remove('on')
            if (status.current) status.current.textContent = 'online'
          } else {
            await espera(900)
          }
          m.classList.add('on')
        }
        await espera(6000)
      }
      rodando = false
    }

    const io = new IntersectionObserver(
      ([e]) => {
        visivel = e.isIntersecting
        if (visivel && !rodando) rodar()
      },
      { threshold: 0.3 },
    )
    io.observe(ol)
    return () => {
      vivo = false
      io.disconnect()
    }
  }, [])

  return (
    <figure className="conversa" data-reveal style={{ '--d': '140ms' } as React.CSSProperties}>
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
          {comoFunciona.conversa.map((m) => (
            <li className={`msg msg--${m.de}`} key={m.texto}>
              {m.texto}
            </li>
          ))}
        </ol>
        <div className="celular__digitando" ref={digitando}>
          <span />
          <span />
          <span />
        </div>
      </div>
      <figcaption className="conversa__legenda">{comoFunciona.conversaLegenda}</figcaption>
    </figure>
  )
}
