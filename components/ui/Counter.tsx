'use client'

import type { ElementType } from 'react'
import { useCountUp, type CountFormat } from '@/hooks/useCountUp'

type CounterProps = CountFormat & {
  /** Valor final. */
  count: number
  /** Texto já formatado, renderizado no HTML estático e no fallback. */
  children: string
  as?: ElementType
  className?: string
}

/**
 * Número que conta ao entrar na viewport.
 *
 * O texto final é o que vai no HTML — quem chega com JS desligado, com
 * movimento reduzido, ou é um crawler, lê o valor correto. A contagem é um
 * enfeite por cima, nunca a fonte do número.
 */
export function Counter({
  count,
  children,
  as: Tag = 'span',
  className,
  ...format
}: CounterProps) {
  const ref = useCountUp<HTMLElement>(count, format)
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
