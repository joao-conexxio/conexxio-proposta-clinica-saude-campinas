'use client'

import { useEffect, useRef } from 'react'

/**
 * Adiciona `is-in` quando o elemento entra na viewport, e para de observar.
 *
 * O CSS faz o resto — o original já tinha os estados `[data-reveal]` e
 * `[data-reveal].is-in` prontos, então aqui não há animação em JS, só o gatilho.
 * Sem IntersectionObserver o elemento nasce revelado, como no original.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15,
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-in')
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return ref
}
