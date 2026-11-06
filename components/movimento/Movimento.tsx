'use client'

import { useEffect } from 'react'

/**
 * Sistema de movimento da página, portado do `base/motion.js` do proposta-kit.
 * Montado uma vez em `app/page.tsx`; não renderiza nada.
 *
 * A marcação declara, este componente executa:
 *
 *   data-reveal    entra subindo quando chega na tela (`--d` atrasa, em ms)
 *   data-desenha   ganha `.is-in` ao chegar na tela, sem mexer em opacidade
 *                  nem posição (o CSS decide o que desenhar: o mapa usa)
 *   data-paralaxe  anda mais devagar que a rolagem (o valor é a fração) e,
 *                  onde há mouse, segue um pouco o cursor
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

    const revelaveis = [...doc.querySelectorAll<HTMLElement>('[data-reveal], [data-desenha]')]
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

    /* Paralaxe das formas de fundo. A posição sai da caixa do PAI (a da
       própria forma muda com o deslocamento e realimentaria a conta). Escreve
       na propriedade `translate`, que soma com qualquer `transform` do CSS em
       vez de substituí-lo. */
    const comMouse = matchMedia('(hover: hover) and (pointer: fine)').matches
    const paralaxes = [...doc.querySelectorAll<HTMLElement>('[data-paralaxe]')].map((el) => ({
      el,
      fator: Number(el.dataset.paralaxe) || 0,
    }))
    if (paralaxes.length) {
      let mx = 0
      let my = 0
      let alvoX = 0
      let alvoY = 0
      let pedido = 0
      const pintar = () => {
        pedido = 0
        mx += (alvoX - mx) * 0.08
        my += (alvoY - my) * 0.08
        const h = innerHeight
        for (const { el, fator } of paralaxes) {
          const pai = el.parentElement
          if (!pai) continue
          const r = pai.getBoundingClientRect()
          if (r.bottom < -200 || r.top > h + 200) continue
          const dy = (h / 2 - (r.top + r.height / 2)) * fator
          el.style.translate = `${(mx * 24).toFixed(1)}px ${(dy + my * 24).toFixed(1)}px`
        }
        if (Math.abs(alvoX - mx) > 0.002 || Math.abs(alvoY - my) > 0.002) agendarParalaxe()
      }
      const agendarParalaxe = () => {
        if (!pedido) pedido = requestAnimationFrame(pintar)
      }
      const aoMover = (ev: PointerEvent) => {
        alvoX = 0.5 - ev.clientX / innerWidth
        alvoY = 0.5 - ev.clientY / innerHeight
        agendarParalaxe()
      }
      addEventListener('scroll', agendarParalaxe, { passive: true })
      addEventListener('resize', agendarParalaxe, { passive: true })
      if (comMouse) addEventListener('pointermove', aoMover, { passive: true })
      pintar()
      limpezas.push(() => {
        cancelAnimationFrame(pedido)
        removeEventListener('scroll', agendarParalaxe)
        removeEventListener('resize', agendarParalaxe)
        removeEventListener('pointermove', aoMover)
      })
    }

    /* Inclinação e brilho seguem o ponteiro — só onde há ponteiro de verdade.
       No toque, o efeito vem da rolagem e do fundo vivo, não daqui. */
    if (comMouse) {
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
