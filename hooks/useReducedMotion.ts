'use client'

import { useEffect, useState } from 'react'

/**
 * `prefers-reduced-motion: reduce`, reativo à troca da preferência.
 *
 * Começa em `false` e só vira `true` depois da montagem: no servidor não há
 * media query, e assumir "reduzido" faria o HTML estático nascer com o estado
 * errado para a maioria.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return reduced
}
