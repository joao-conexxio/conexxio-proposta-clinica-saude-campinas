'use client'

import { useRef } from 'react'
import { CtaLink } from '@/components/ui/CtaLink'
import { IconeWhatsapp } from '@/components/ui/icons'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { asset } from '@/lib/asset'
import { nav, site, waGeral } from '@/content/lp'

/**
 * O menu some abaixo de 900px e não vira hambúrguer: no celular a saída que
 * importa é a barra fixa do rodapé, e um menu escondido atrás de um ícone só
 * acrescentaria um toque entre a pessoa e o WhatsApp. Os itens continuam
 * acessíveis pelo rodapé.
 */
export function Header() {
  const headerRef = useRef<HTMLElement>(null)
  const progressoRef = useRef<HTMLDivElement>(null)
  useScrollProgress(headerRef, progressoRef)

  return (
    <header className="cabecalho" ref={headerRef}>
      <div className="wrap cabecalho__linha">
        <a className="cabecalho__marca" href="#topo" aria-label={`${site.nome}, ir para o topo`}>
          <img
            src={asset('/brand/logo-clinica.png')}
            alt={site.nome}
            width={398}
            height={238}
          />
        </a>

        <nav className="cabecalho__nav" aria-label="Seções da página">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <CtaLink
          className="btn btn--acao cabecalho__cta"
          href={waGeral}
          cta="header"
          external
        >
          <IconeWhatsapp className="btn__zap" />
          Agendar
        </CtaLink>
      </div>

      <div className="progresso" ref={progressoRef} aria-hidden />
    </header>
  )
}
