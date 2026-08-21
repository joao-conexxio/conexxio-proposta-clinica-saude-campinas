'use client'

import { useEffect } from 'react'

/**
 * Header encolhido + barra de progresso de leitura, num handler só com rAF —
 * como no original, para não ter dois listeners de scroll disputando a thread.
 *
 * Escreve numa custom property e numa classe em vez de estado do React: são
 * dezenas de atualizações por segundo e nenhuma delas muda a árvore.
 *
 * Onde o browser suporta `animation-timeline: scroll()`, o CSS já anima a barra
 * fora da thread principal; o `--p` daqui vira redundante e inofensivo.
 */
export function useScrollProgress(
  headerRef: React.RefObject<HTMLElement | null>,
  progressRef: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    let queued = false

    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(() => {
        queued = false
        const y = window.scrollY

        headerRef.current?.classList.toggle('is-stuck', y > 12)

        const max = document.documentElement.scrollHeight - window.innerHeight
        const p = max > 0 ? Math.min(Math.max(y / max, 0), 1) : 0
        progressRef.current?.style.setProperty('--p', String(p))
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [headerRef, progressRef])
}
