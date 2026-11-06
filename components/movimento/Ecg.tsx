/**
 * Traçado de eletrocardiograma (onda P, complexo QRS, onda T), portado do
 * motivo `ecg` do proposta-kit. É o motivo que o kit indica para clínica geral
 * e popular, e esta clínica faz eletro, Holter e MAPA no próprio endereço.
 *
 * Duas camadas:
 * - a linha de base se desenha da esquerda para a direita, uma vez, no
 *   carregamento (o comprimento vem do `pathLength`, então a animação é a
 *   mesma para qualquer número de batidas);
 * - depois disso, um trecho mais forte da mesma linha corre por cima dela sem
 *   parar, com um rastro que se apaga, como num monitor cardíaco.
 *
 * O trecho forte é uma "janela" que anda para a direita enquanto o desenho
 * dentro dela anda para a esquerda na mesma medida: o traço fica parado e só
 * a janela passa. As duas são `transform`, então rodam no compositor e não
 * pesam na rolagem do celular.
 *
 * Sob movimento reduzido a linha aparece inteira e parada, sem a janela.
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
  const d = tracado(batidas)
  const caixa = `0 0 ${batidas * BATIDA} 88`
  return (
    <div className={`ecg ${className}`} aria-hidden>
      <svg
        className="ecg__base"
        viewBox={caixa}
        preserveAspectRatio="xMinYMid slice"
        focusable="false"
      >
        <path d={d} pathLength={1000} />
      </svg>
      <span className="ecg__janela">
        <span className="ecg__dentro">
          <svg
            className="ecg__pulso"
            viewBox={caixa}
            preserveAspectRatio="xMinYMid slice"
            focusable="false"
          >
            <path d={d} />
          </svg>
        </span>
      </span>
    </div>
  )
}
