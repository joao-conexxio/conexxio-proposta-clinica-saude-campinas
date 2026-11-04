/**
 * Traçado de eletrocardiograma (onda P, complexo QRS, onda T), portado do
 * motivo `ecg` do proposta-kit. É o motivo que o kit indica para clínica geral
 * e popular, e esta clínica faz eletro, Holter e MAPA no próprio endereço.
 *
 * No hero ele se desenha da esquerda para a direita, uma vez, no carregamento.
 * O comprimento vem do `pathLength`, então a animação é a mesma para qualquer
 * número de batidas. Sob movimento reduzido aparece inteiro e parado.
 */
const BATIDA = 200
const BASE = 44

function batida(x: number): string {
  return [
    `L ${x + 34} ${BASE}`,
    `Q ${x + 44} 31, ${x + 54} ${BASE}`,
    `L ${x + 66} ${BASE}`,
    `L ${x + 72} 51`,
    `L ${x + 80} 9`,
    `L ${x + 88} 58`,
    `L ${x + 94} ${BASE}`,
    `L ${x + 108} ${BASE}`,
    `Q ${x + 124} 25, ${x + 140} ${BASE}`,
    `L ${x + BATIDA} ${BASE}`,
  ].join(' ')
}

function tracado(batidas: number): string {
  let d = `M 0 ${BASE}`
  for (let i = 0; i < batidas; i++) d += ' ' + batida(i * BATIDA)
  return d
}

export function Ecg({ batidas = 8, className = '' }: { batidas?: number; className?: string }) {
  return (
    <svg
      className={`ecg ${className}`}
      viewBox={`0 0 ${batidas * BATIDA} 88`}
      preserveAspectRatio="xMinYMid slice"
      aria-hidden
      focusable="false"
    >
      <path d={tracado(batidas)} pathLength={1000} />
    </svg>
  )
}
