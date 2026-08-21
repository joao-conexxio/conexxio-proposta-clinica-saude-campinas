'use client'

import { useId, useMemo, useState } from 'react'
import { CtaLink } from '@/components/ui/CtaLink'
import { RichText } from '@/components/ui/RichText'
import { IconeLupa, IconeSeta, IconeWhatsapp, IconeX } from '@/components/ui/icons'
import { quadro, waGeral, whatsapp } from '@/content/lp'

/** "Cardiologista" e "cardiologista" e "Cardiológico" caem no mesmo termo. */
function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

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
 */
export function Quadro() {
  const [aba, setAba] = useState<string>('tudo')
  const [termo, setTermo] = useState('')
  const buscaId = useId()

  const abas = useMemo(
    () => [{ id: 'tudo', label: quadro.todosLabel }, ...quadro.grupos.map((g) => ({ id: g.id, label: g.label }))],
    [],
  )

  const gruposVisiveis = useMemo(() => {
    const t = normalizar(termo)
    return quadro.grupos
      .filter((g) => aba === 'tudo' || g.id === aba)
      .map((g) => ({
        ...g,
        itens: t
          ? g.itens.filter((item) =>
              normalizar(`${item.nome} ${item.nota ?? ''} ${item.chaves ?? ''} ${g.label}`).includes(t),
            )
          : g.itens,
      }))
      .filter((g) => g.itens.length > 0)
  }, [aba, termo])

  const total = gruposVisiveis.reduce((soma, g) => soma + g.itens.length, 0)

  return (
    <section className="secao secao--blush" id="quadro">
      <div className="wrap">
        <div className="quadro__cabeca">
          <p className="rotulo">{quadro.eyebrow}</p>
          <h2 className="h2">{quadro.titulo}</h2>
          <p className="lead">
            <RichText text={quadro.lead} />
          </p>
        </div>

        <div className="quadro__controles">
          <div className="abas" role="tablist" aria-label="Tipo de atendimento">
            {abas.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                className="aba"
                aria-selected={aba === item.id}
                onClick={() => setAba(item.id)}
              >
                {item.label}
              </button>
            ))}
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
              onChange={(e) => setTermo(e.target.value)}
              autoComplete="off"
            />
            {termo && (
              <button
                type="button"
                className="busca__limpar"
                onClick={() => setTermo('')}
                aria-label="Limpar busca"
              >
                <IconeX />
              </button>
            )}
          </div>
        </div>

        {/* aria-live: quem usa leitor de tela ouve o resultado mudar ao digitar. */}
        <p className="quadro__resumo" aria-live="polite">
          <span className="quadro__contagem">{quadro.contagem(total)}</span>
          {termo && <span>para “{termo}”</span>}
        </p>

        {total === 0 ? (
          <div className="quadro__lista">
            <p className="quadro__vazio">{quadro.vazio}</p>
          </div>
        ) : (
          gruposVisiveis.map((grupo) => (
            <div className="grupo" key={grupo.id}>
              <h3 className="grupo__titulo">{grupo.titulo}</h3>
              <p className="grupo__resumo">{grupo.resumo}</p>

              <ul className="quadro__lista">
                {grupo.itens.map((item, i) => (
                  <li
                    className="item"
                    key={item.nome}
                    style={{ animationDelay: `${Math.min(i, 12) * 24}ms` }}
                  >
                    <span className="item__nome">
                      {item.nome}
                      {item.nota && <span className="item__nota">{item.nota}</span>}
                    </span>
                    <CtaLink
                      className="item__agendar"
                      href={whatsapp(
                        `Olá! Vim pelo site e gostaria de agendar: ${item.nome}.`,
                      )}
                      cta={`quadro:${item.nome}`}
                      external
                    >
                      {quadro.agendarRotulo}
                      <IconeSeta className="item__seta" />
                    </CtaLink>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}

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
