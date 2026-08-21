import { CtaLink } from '@/components/ui/CtaLink'
import { IconeWhatsapp } from '@/components/ui/icons'
import { waGeral } from '@/content/lp'

/**
 * Barra fixa do rodapé, só abaixo de 640px (o CSS decide, não o JS: assim não
 * há troca de layout depois da hidratação).
 *
 * No celular o menu do header some e a página é longa. Sem isto, quem termina
 * de ler o FAQ precisa rolar de volta ao topo para achar uma saída.
 */
export function BarraMobile() {
  return (
    <div className="barraMobile">
      <CtaLink className="btn btn--acao" href={waGeral} cta="barra-mobile" external>
        <IconeWhatsapp className="btn__zap" />
        Agendar no WhatsApp
      </CtaLink>
    </div>
  )
}
