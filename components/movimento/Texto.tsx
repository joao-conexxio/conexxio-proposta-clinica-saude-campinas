import type { CSSProperties, ReactNode } from 'react'

/**
 * Quebra de texto em palavras para o movimento, feita no build e não no
 * navegador: o HTML já nasce com os spans, então não há troca de layout depois
 * da primeira pintura nem DOM mexido por baixo do React.
 *
 * Os espaços voltam como nós de texto de verdade, então o texto lido por
 * buscador e leitor de tela é idêntico ao original.
 */
function emPalavras(texto: string, classe: string, inicio: number): [ReactNode[], number] {
  let i = inicio
  const nos: ReactNode[] = []
  for (const parte of texto.split(/(\s+)/)) {
    if (!parte) continue
    if (/^\s+$/.test(parte)) {
      nos.push(parte)
      continue
    }
    nos.push(
      <span key={i} className={classe} style={{ '--i': i } as CSSProperties}>
        {parte}
      </span>,
    )
    i++
  }
  return [nos, i]
}

/** Título que sobe palavra por palavra no carregamento (CSS em `.js .w`). */
export function Palavras({ texto }: { texto: string }) {
  return <>{emPalavras(texto, 'w', 0)[0]}</>
}

/**
 * Texto que acende palavra por palavra conforme a rolagem (o componente
 * `Movimento` liga `.on` em cada `.p`). Aceita a mesma marcação `**negrito**`
 * do resto da copy.
 */
export function Acende({ texto }: { texto: string }) {
  let i = 0
  const nos: ReactNode[] = []
  texto.split(/(\*\*[^*]+\*\*)/).forEach((parte, k) => {
    if (!parte) return
    const negrito = parte.startsWith('**') && parte.endsWith('**')
    const [palavras, prox] = emPalavras(negrito ? parte.slice(2, -2) : parte, 'p', i)
    i = prox
    nos.push(negrito ? <strong key={`b${k}`}>{palavras}</strong> : <span key={`t${k}`}>{palavras}</span>)
  })
  return <>{nos}</>
}
