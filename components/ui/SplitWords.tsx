import type { CSSProperties, ReactNode } from 'react'

/**
 * Divide texto em `<span class="w">` por palavra, com atraso em cascata de 46ms
 * — os mesmos spans que o original criava por DOM surgery depois do load.
 *
 * Aqui eles já nascem no HTML, o que é melhor em dois sentidos: não há troca de
 * layout depois da primeira pintura, e o texto continua inteiro para quem lê o
 * source (os espaços entre spans são nós de texto de verdade, então o H1 lê
 * exatamente como antes).
 *
 * Todo o CSS que anima `.w` está atrás de `.js` e desligado em movimento
 * reduzido, então sem JavaScript o texto simplesmente aparece.
 */
export function splitWords(text: string, startIndex: number): [ReactNode[], number] {
  let idx = startIndex
  const nodes: ReactNode[] = []

  for (const part of text.split(/(\s+)/)) {
    if (!part) continue
    if (/^\s+$/.test(part)) {
      nodes.push(part)
      continue
    }
    nodes.push(
      <span key={`${idx}-${part}`} className="w" style={{ '--wd': `${idx * 46}ms` } as CSSProperties}>
        {part}
      </span>,
    )
    idx++
  }

  return [nodes, idx]
}

/** Versão de uso direto, para títulos sem marcação interna. */
export function SplitWords({ text }: { text: string }) {
  return <>{splitWords(text, 0)[0]}</>
}
