'use client'

import { useEffect, useRef } from 'react'
import { CtaLink } from '@/components/ui/CtaLink'
import { IconeWhatsapp } from '@/components/ui/icons'
import { waGeral } from '@/content/lp'

/**
 * Barra fixa do rodapé, só abaixo de 640px (o CSS decide, não o JS: assim não
 * há troca de layout depois da hidratação).
 *
 * No celular o menu do header some e a página é longa. Sem isto, quem termina
 * de ler o FAQ precisa rolar de volta ao topo para achar uma saída.
 *
 * Ela só aparece quando nenhum outro botão de agendar está na tela: some no
 * hero, no quadro (onde cada linha já é um botão), no fim dos passos e no
 * cartão de fechamento. Dois botões iguais na mesma tela viram ruído. Sem
 * JavaScript ela fica sempre visível.
 */
export function BarraMobile() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const barra = ref.current
    const alvos = [...document.querySelectorAll('[data-cta-zona]')]
    if (!barra || !alvos.length || !('IntersectionObserver' in window)) {
      barra?.classList.add('is-visivel')
      return
    }

    const visiveis = new Set<Element>()
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visiveis.add(entry.target)
        else visiveis.delete(entry.target)
      }
      barra.classList.toggle('is-visivel', visiveis.size === 0)
    })
    alvos.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="barraMobile" ref={ref}>
      <CtaLink className="btn btn--acao" href={waGeral} cta="barra-mobile" external>
        <IconeWhatsapp className="btn__zap" />
        Agendar no WhatsApp
      </CtaLink>
    </div>
  )
}
