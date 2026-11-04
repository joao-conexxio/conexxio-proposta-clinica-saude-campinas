'use client'

import { useEffect } from 'react'

/**
 * Sistema de movimento da página, portado do `base/motion.js` do proposta-kit.
 * Montado uma vez em `app/page.tsx`; não renderiza nada.
 *
 * A marcação declara, este componente executa:
 *
 *   data-reveal    entra subindo quando chega na tela (`--d` atrasa, em ms)
 *   data-acende    texto acende palavra por palavra conforme a rolagem
 *                  (os spans `.p` vêm prontos do componente `Acende`)
 *   data-tilt      inclina seguindo o cursor (só onde há mouse)
 *   data-glow      brilho que segue o cursor (só onde há mouse)
 *
 * Só transform e opacity: tudo no compositor, nada de recalcular layout.
 * Com movimento reduzido tudo nasce visível e parado. Sem JavaScript também,
 * porque todo o CSS de estado inicial está atrás de `.js`.
 */
export function Movimento() {
  useEffect(() => {
    const doc = document
    const parado = matchMedia('(prefers-reduced-motion: reduce)').matches
    const limpezas: Array<() => void> = []

    const revelaveis = [...doc.querySelectorAll<HTMLElement>('[data-reveal]')]
    const acendiveis = [...doc.querySelectorAll<HTMLElement>('[data-acende]')].map((el) => ({
      el,
      palavras: [...el.querySelectorAll<HTMLElement>('.p')],
    }))

    if (parado) {
      revelaveis.forEach((el) => el.classList.add('is-in'))
      acendiveis.forEach(({ palavras }) => palavras.forEach((p) => p.classList.add('on')))
      return
    }

    /* Revelação por rolagem. */
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue
          e.target.classList.add('is-in')
          obs.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    )
    revelaveis.forEach((el) => obs.observe(el))
    limpezas.push(() => obs.disconnect())

    /* Texto que acende com a rolagem. No fim da página não há mais rolagem
       para acender o resto: o que estiver na tela acende inteiro. */
    if (acendiveis.length) {
      const limitar = (v: number) => Math.min(1, Math.max(0, v))
      let pendente = false
      const quadro = () => {
        pendente = false
        const h = innerHeight
        const fim = scrollY + h >= doc.documentElement.scrollHeight - 4
        for (const { el, palavras } of acendiveis) {
          const r = el.getBoundingClientRect()
          const prog = fim && r.top < h ? 1 : limitar((h * 0.85 - r.top) / (r.height + h * 0.35))
          const acesas = Math.ceil(prog * palavras.length)
          palavras.forEach((p, i) => p.classList.toggle('on', i < acesas))
        }
      }
      const agendar = () => {
        if (pendente) return
        pendente = true
        requestAnimationFrame(quadro)
      }
      addEventListener('scroll', agendar, { passive: true })
      addEventListener('resize', agendar, { passive: true })
      quadro()
      limpezas.push(() => {
        removeEventListener('scroll', agendar)
        removeEventListener('resize', agendar)
      })
    }

    /* Inclinação e brilho seguem o ponteiro — só onde há ponteiro de verdade.
       No toque, o efeito vem da rolagem e do fundo vivo, não daqui. */
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      doc.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
        const mover = (ev: PointerEvent) => {
          const r = el.getBoundingClientRect()
          const x = (ev.clientX - r.left) / r.width - 0.5
          const y = (ev.clientY - r.top) / r.height - 0.5
          el.style.transform = `perspective(1000px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`
        }
        const sair = () => {
          el.style.transform = ''
        }
        el.addEventListener('pointermove', mover)
        el.addEventListener('pointerleave', sair)
        limpezas.push(() => {
          el.removeEventListener('pointermove', mover)
          el.removeEventListener('pointerleave', sair)
        })
      })

      // Delegado no documento: os itens do quadro entram e saem com o filtro,
      // então ouvir cada um perderia os que chegam depois.
      const brilho = (ev: PointerEvent) => {
        const el = (ev.target as Element | null)?.closest<HTMLElement>('[data-glow]')
        if (!el) return
        const r = el.getBoundingClientRect()
        el.style.setProperty('--gx', `${ev.clientX - r.left}px`)
        el.style.setProperty('--gy', `${ev.clientY - r.top}px`)
      }
      doc.addEventListener('pointermove', brilho, { passive: true })
      limpezas.push(() => doc.removeEventListener('pointermove', brilho))
    }

    return () => limpezas.forEach((f) => f())
  }, [])

  return null
}
