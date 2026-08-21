import type { ReactNode } from 'react'

/**
 * Renderiza `**trecho**` como <strong>.
 *
 * O negrito mora no conteúdo, não na marcação, porque quem edita a copy é quem
 * decide o que merece peso. Sem isso, destacar uma frase exigiria mexer em JSX.
 */
export function rich(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      part
    ),
  )
}

export function RichText({ text }: { text: string }) {
  return <>{rich(text)}</>
}
