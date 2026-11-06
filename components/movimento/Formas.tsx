/**
 * Formas de fundo: anéis concêntricos, um disco no azul bem diluído, dois
 * arcos no azul oficial e a cruz pontilhada da saúde. Vêm da arte `formas` do
 * proposta-kit e são o único desenho de fundo da página, repetido no topo e na
 * faixa azul da estrutura, para o guia ("evitar excesso de elementos") ser
 * respeitado: uma forma só, sempre a mesma.
 *
 * Vida discreta: os arcos giram devagar em volta do centro e um ponto azul
 * percorre o anel do meio. `data-paralaxe` faz o conjunto andar um pouco mais
 * devagar que a rolagem (e seguir o mouse, no desktop), o que dá profundidade
 * sem mexer em nenhum texto. Tudo para sob movimento reduzido.
 *
 * Nunca encosta no logotipo: o guia pede área de proteção em volta dele.
 */
export function Formas({
  className = '',
  paralaxe = 0.12,
}: {
  className?: string
  /** Quanto a forma se desloca em relação à rolagem (0 = presa ao conteúdo). */
  paralaxe?: number
}) {
  return (
    <div className={`formas ${className}`} data-paralaxe={paralaxe} aria-hidden>
      <svg viewBox="0 0 400 400" focusable="false">
        <circle className="formas__disco" cx="200" cy="200" r="86" />
        <circle className="formas__anel" cx="200" cy="200" r="176" />
        <circle className="formas__anel" cx="200" cy="200" r="132" />
        <line className="formas__fio" x1="200" y1="0" x2="200" y2="400" />
        <line className="formas__fio" x1="0" y1="200" x2="400" y2="200" />
        <g className="formas__giro">
          <path className="formas__arco" d="M 24 200 A 176 176 0 0 1 200 24" />
          <path className="formas__arco" d="M 376 200 A 176 176 0 0 1 200 376" />
        </g>
        <g className="formas__orbita">
          <circle className="formas__ponto" cx="200" cy="68" r="5" />
        </g>
      </svg>
    </div>
  )
}
