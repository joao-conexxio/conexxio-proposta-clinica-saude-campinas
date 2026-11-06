'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { CtaLink } from '@/components/ui/CtaLink'
import { IconeSaude } from '@/components/ui/IconeSaude'
import { RichText } from '@/components/ui/RichText'
import { IconeLupa, IconeSeta, IconeWhatsapp, IconeX } from '@/components/ui/icons'
import { quadro, waGeral, whatsapp } from '@/content/lp'

/** "Cardiologista" e "cardiologista" e "Cardiológico" caem no mesmo termo. */
function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

const parado = () =>
  typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * O quadro de atendimentos — a seção que a página existe para ter.
 *
 * No site atual as três listas moram em três páginas separadas, então quem
 * busca "dermatologista em Campinas" não encontra a palavra na home. Aqui elas
 * ficam juntas, e cada linha abre o WhatsApp já dizendo qual atendimento a
 * pessoa quer, em vez da mesma frase genérica que os seis botões de lá mandam.
 *
 * A aba inicial é "Tudo" de propósito: assim o HTML estático nasce com os 29
 * nomes dentro dele, o que serve tanto para busca quanto para quem chega sem
 * JavaScript. Filtro e abas são melhorias por cima de uma lista que já está
 * inteira na página.
 *
 * Movimento (todo ele resposta a um toque, nunca enfeite solto):
 * - cada item tem um ícone, que ajuda quem não sabe o que é
 *   "otorrinolaringologista" a achar o ouvido;
 * - o destaque azul desliza de um filtro para o outro;
 * - ao filtrar, os itens que continuam deslizam até o lugar novo em vez de
 *   pular, e os que chegam entram em cascata;
 * - no celular os filtros ficam presos no topo enquanto a lista passa, porque
 *   a lista inteira ocupa quase quatro telas.
 */
export function Quadro() {
  const [aba, setAba] = useState<string>('tudo')
  const [termo, setTermo] = useState('')
  const buscaId = useId()

  const abasRef = useRef<HTMLDivElement>(null)
  const indicadorRef = useRef<HTMLSpanElement>(null)
  const listaRef = useRef<HTMLDivElement>(null)
  const resumoRef = useRef<HTMLParagraphElement>(null)
  const sentinelaRef = useRef<HTMLDivElement>(null)
  const posicoes = useRef(new Map<string, DOMRect>())
  const [vivo, setVivo] = useState(false)
  const [preso, setPreso] = useState(false)

  const abas = useMemo(
    () => [
      { id: 'tudo', label: quadro.todosLabel },
      ...quadro.grupos.map((g) => ({ id: g.id, label: g.label })),
    ],
    [],
  )

  const gruposVisiveis = useMemo(() => {
    /**
     * Cada palavra digitada precisa aparecer, em qualquer ordem — e não a frase
     * inteira em sequência. Quem escreve "dentista de criança" está procurando
     * odontopediatria, e uma comparação de substring contígua devolveria nada.
     */
    const termos = normalizar(termo).split(/\s+/).filter(Boolean)

    return quadro.grupos
      .filter((g) => aba === 'tudo' || g.id === aba)
      .map((g) => ({
        ...g,
        itens: termos.length
          ? g.itens.filter((item) => {
              const alvo = normalizar(
                `${item.nome} ${item.nota ?? ''} ${item.chaves ?? ''} ${g.label} ${g.titulo}`,
              )
              return termos.every((t) => alvo.includes(t))
            })
          : g.itens,
      }))
      .filter((g) => g.itens.length > 0)
  }, [aba, termo])

  const total = gruposVisiveis.reduce((soma, g) => soma + g.itens.length, 0)

  /* Destaque que desliza: mede o filtro ativo e leva a pílula até ele. */
  const moverIndicador = useCallback(() => {
    const caixa = abasRef.current
    const ind = indicadorRef.current
    const ativo = caixa?.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (!caixa || !ind || !ativo) return
    ind.style.width = `${ativo.offsetWidth}px`
    ind.style.transform = `translateX(${ativo.offsetLeft}px)`
  }, [])

  useLayoutEffect(() => {
    moverIndicador()
  }, [aba, vivo, moverIndicador])

  useEffect(() => {
    // Só depois de montar: sem JS o filtro ativo continua pintado pelo CSS.
    setVivo(true)
    addEventListener('resize', moverIndicador, { passive: true })
    // A fonte pode chegar depois da primeira medida e mudar a largura.
    document.fonts?.ready.then(moverIndicador)
    return () => removeEventListener('resize', moverIndicador)
  }, [moverIndicador])

  /* Filtros presos no topo (celular): a sentinela sai da tela, a faixa ganha
     fundo e filete. O CSS faz o sticky; isto só decide o acabamento. */
  useEffect(() => {
    const s = sentinelaRef.current
    if (!s) return
    const io = new IntersectionObserver(([e]) => {
      setPreso(!e.isIntersecting && e.boundingClientRect.top < 0)
    })
    io.observe(s)
    return () => io.disconnect()
  }, [])

  /* Itens que deslizam até o lugar novo (técnica FLIP): antes de mudar o
     filtro, guarda onde cada item estava; depois do render, cada um que
     continua na tela parte da posição antiga e desliza até a nova. */
  const guardarPosicoes = () => {
    const mapa = posicoes.current
    mapa.clear()
    listaRef.current?.querySelectorAll<HTMLElement>('[data-item]').forEach((el) => {
      mapa.set(el.dataset.item!, el.getBoundingClientRect())
    })
  }

  useLayoutEffect(() => {
    const mapa = posicoes.current
    if (!mapa.size || parado()) return
    listaRef.current?.querySelectorAll<HTMLElement>('[data-item]').forEach((el) => {
      const antes = mapa.get(el.dataset.item!)
      if (!antes) return
      const agora = el.getBoundingClientRect()
      const dx = antes.left - agora.left
      const dy = antes.top - agora.top
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return
      // Quem viajaria meia tela não desliza: entra no lugar, como os novos.
      if (Math.abs(dy) > 320) {
        el.animate(
          [
            { opacity: 0, transform: 'translateY(8px)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 300, easing: 'cubic-bezier(0.22, 0.75, 0.28, 1)' },
        )
        return
      }
      el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], {
        duration: 420,
        easing: 'cubic-bezier(0.22, 0.75, 0.28, 1)',
      })
    })
    mapa.clear()
  }, [aba, termo])

  const escolherAba = (id: string) => {
    if (id === aba) return
    guardarPosicoes()
    setAba(id)
    // Se a faixa está presa e a pessoa já desceu pela lista, volta para o
    // começo do resultado novo, logo abaixo dos filtros.
    const resumo = resumoRef.current
    if (preso && resumo && resumo.getBoundingClientRect().top < 0) {
      requestAnimationFrame(() =>
        resumo.scrollIntoView({ block: 'start', behavior: parado() ? 'auto' : 'smooth' }),
      )
    }
  }

  const buscar = (valor: string) => {
    guardarPosicoes()
    setTermo(valor)
    // A busca vale para a lista inteira: quem procura "coração" com o filtro
    // de Odontologia ligado não pode receber "nada encontrado".
    if (valor.trim() && aba !== 'tudo') setAba('tudo')
  }

  return (
    <section className="secao secao--nevoa" id="quadro" data-cta-zona>
      <div className="wrap">
        <div className="quadro__cabeca" data-reveal>
          <h2 className="h2">{quadro.titulo}</h2>
          <p className="lead">
            <RichText text={quadro.lead} />
          </p>
        </div>

        <div className="quadro__controles">
          <div className="quadro__sentinela" ref={sentinelaRef} aria-hidden />
          {/* Filtros, não abas: todos mostram a mesma lista, só que recortada.
              `aria-pressed` diz ao leitor de tela qual está ativo. */}
          <div className={`quadro__filtros${preso ? ' is-preso' : ''}`}>
            <div
              className={`abas${vivo ? ' abas--viva' : ''}`}
              role="group"
              aria-label="Filtrar por tipo de atendimento"
              ref={abasRef}
            >
              <span className="abas__indicador" ref={indicadorRef} aria-hidden />
              {abas.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="aba"
                  aria-pressed={aba === item.id}
                  onClick={() => escolherAba(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="busca">
            <label className="sr" htmlFor={buscaId}>
              {quadro.buscaLabel}
            </label>
            <IconeLupa className="busca__lupa" />
            <input
              id={buscaId}
              className="busca__campo"
              type="search"
              value={termo}
              placeholder={quadro.buscaPlaceholder}
              onChange={(e) => buscar(e.target.value)}
              autoComplete="off"
              enterKeyHint="search"
            />
            {termo && (
              <button
                type="button"
                className="busca__limpar"
                onClick={() => buscar('')}
                aria-label="Limpar busca"
              >
                <IconeX />
              </button>
            )}
          </div>
        </div>

        {/* aria-live: quem usa leitor de tela ouve o resultado mudar ao digitar. */}
        <p className="quadro__resumo" aria-live="polite" ref={resumoRef}>
          <span className="quadro__contagem">{quadro.contagem(total)}</span>
          {termo && <span>para “{termo}”</span>}
        </p>

        <div ref={listaRef}>
          {total === 0 ? (
            <div className="quadro__lista">
              <p className="quadro__vazio">{quadro.vazio}</p>
            </div>
          ) : (
            gruposVisiveis.map((grupo) => (
              <div className="grupo" key={grupo.id}>
                <div className="grupo__cabeca">
                  <span className="grupo__ico">
                    <IconeSaude nome={grupo.icone} />
                  </span>
                  <div>
                    <h3 className="grupo__titulo">{grupo.titulo}</h3>
                    <p className="grupo__resumo">{grupo.resumo}</p>
                  </div>
                </div>

                <ul className="quadro__lista">
                  {grupo.itens.map((item, i) => (
                    <li key={item.nome} data-item={item.nome}>
                      {/* A linha inteira é o link: no celular o alvo de toque é a
                          largura da tela, não só a pílula "Agendar". */}
                      <CtaLink
                        className="item"
                        glow
                        style={{ animationDelay: `${Math.min(i, 12) * 28}ms` }}
                        href={whatsapp(`Olá! Vim pelo site e gostaria de agendar: ${item.nome}.`)}
                        cta={`quadro:${item.nome}`}
                        ariaLabel={`Agendar ${item.nome} pelo WhatsApp`}
                        external
                      >
                        <span className="item__ico">
                          <IconeSaude nome={item.icone} />
                        </span>
                        <span className="item__nome">
                          {item.nome}
                          {item.nota && <span className="item__nota">{item.nota}</span>}
                        </span>
                        <span className="item__agendar" aria-hidden>
                          {quadro.agendarRotulo}
                          <IconeSeta className="item__seta" />
                        </span>
                      </CtaLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        <div className="quadro__rodape">
          <CtaLink className="btn btn--acao" href={waGeral} cta="quadro-rodape" external>
            <IconeWhatsapp className="btn__zap" />
            Não achei o que preciso
          </CtaLink>
          <p className="quadro__rodapeNota">{quadro.rodapeNota}</p>
        </div>
      </div>
    </section>
  )
}
