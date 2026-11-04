'use client'

import type { CSSProperties, ReactNode } from 'react'
import { trackCta } from '@/lib/track'

type CtaLinkProps = {
  href: string
  cta: string
  children: ReactNode
  className?: string
  style?: CSSProperties
  /** Nome acessível quando o texto visível sozinho não diz para onde o link leva. */
  ariaLabel?: string
  /** Brilho que segue o cursor no desktop (ver `Movimento`). */
  glow?: boolean
  external?: boolean
}

/** Link de CTA que dispara o evento de conversão. Substitui os `data-cta`. */
export function CtaLink({
  href,
  cta,
  children,
  className,
  style,
  ariaLabel,
  glow,
  external,
}: CtaLinkProps) {
  return (
    <a
      className={className}
      style={style}
      href={href}
      aria-label={ariaLabel}
      data-glow={glow || undefined}
      onClick={() => trackCta(cta)}
      {...(external ? { target: '_blank', rel: 'noopener' } : {})}
    >
      {children}
    </a>
  )
}
