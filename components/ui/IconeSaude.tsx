import { ICONES_SAUDE, type NomeIcone } from './icones-saude-dados'

/**
 * Ícone de traço da área da saúde (desenhos em `icones-saude-dados.ts`).
 * Decorativo: o nome ao lado já diz o que é, então sai do leitor de tela.
 */
export function IconeSaude({ nome, className }: { nome: NomeIcone; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      dangerouslySetInnerHTML={{ __html: ICONES_SAUDE[nome] }}
    />
  )
}

export type { NomeIcone }
