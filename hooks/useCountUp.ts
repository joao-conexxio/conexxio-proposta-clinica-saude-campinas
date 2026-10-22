'use client'

import { useEffect, useRef } from 'react'

export type CountFormat = {
  prefix?: string
  suffix?: string
  decimals?: number
  /** Agrupamento de milhar pt-BR: 6664 → "6.664". */
  group?: boolean
}

/** Formata no padrão pt-BR, com o mesmo prefixo do texto estático. */
export function formatCount(v: number, o: CountFormat): string {
  const prefix = o.prefix ?? ''
  const suffix = o.suffix ?? ''

  if (o.group) {
    return prefix + Math.round(v).toLocaleString('pt-BR') + suffix
  }
  return prefix + v.toFixed(o.decimals ?? 0).replace('.', ',') + suffix
}

/**
 * Conta de 0 até `target` quando o elemento entra na viewport, uma única vez.
 *
 * Escreve direto no `textContent` em vez de passar por estado do React: são
 * ~78 quadros por contador e re-renderizar a árvore a cada um seria desperdício
 * puro. O valor final também é o que já veio no HTML estático, então quem
 * chega com JS desligado — ou com movimento reduzido — lê o número certo.
 */
export function useCountUp<T extends HTMLElement = HTMLElement>(
  target: number,
  opts: CountFormat = {},
  duration = 1300,
) {
  const ref = useRef<T>(null)
  // Evita reiniciar a animação quando o objeto de opções muda de identidade.
  const optsRef = useRef(opts)
  optsRef.current = opts

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let start: number | null = null

    const frame = (ts: number) => {
      if (start === null) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      el.textContent = formatCount(target * eased, optsRef.current)
      if (p < 1) raf = requestAnimationFrame(frame)
      else el.textContent = formatCount(target, optsRef.current)
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            raf = requestAnimationFrame(frame)
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.6 },
    )

    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [target, duration])

  return ref
}
