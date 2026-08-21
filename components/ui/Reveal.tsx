'use client'

import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useReveal } from '@/hooks/useReveal'

type RevealProps = {
  children: ReactNode
  /** "deck" usa a variante de cartas sendo baixadas; ver globals.css. */
  variant?: '' | 'deck'
  /** Atraso em cascata, em ms. Vira a custom property `--d`. */
  delay?: number
  as?: ElementType
  className?: string
  style?: CSSProperties
  id?: string
  'aria-label'?: string
}

/**
 * Envelope do reveal por scroll. Só marca `data-reveal` e adiciona `is-in` ao
 * entrar na viewport — a animação inteira mora no CSS, que já tinha os dois
 * estados prontos e roda só transform/opacity, no compositor.
 */
export function Reveal({
  children,
  variant = '',
  delay,
  as: Tag = 'div',
  className,
  style,
  ...rest
}: RevealProps) {
  const ref = useReveal<HTMLElement>()

  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      className={className}
      style={delay ? ({ ...style, '--d': `${delay}ms` } as CSSProperties) : style}
      {...rest}
    >
      {children}
    </Tag>
  )
}
