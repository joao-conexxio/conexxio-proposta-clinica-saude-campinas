'use client'

import type { ReactNode } from 'react'
import { trackCta } from '@/lib/track'

type CtaLinkProps = {
  href: string
  cta: string
  children: ReactNode
  className?: string
  external?: boolean
}

/** Link de CTA que dispara o evento de conversão. Substitui os `data-cta`. */
export function CtaLink({ href, cta, children, className, external }: CtaLinkProps) {
  return (
    <a
      className={className}
      href={href}
      onClick={() => trackCta(cta)}
      {...(external ? { target: '_blank', rel: 'noopener' } : {})}
    >
      {children}
    </a>
  )
}
