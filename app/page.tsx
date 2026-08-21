import { Footer } from '@/components/chrome/Footer'
import { Header } from '@/components/chrome/Header'
import { AClinica } from '@/components/sections/AClinica'
import { ComoFunciona } from '@/components/sections/ComoFunciona'
import { Hero } from '@/components/sections/Hero'
import { Numeros } from '@/components/sections/Numeros'
import { OndeFica } from '@/components/sections/OndeFica'
import { Perguntas } from '@/components/sections/Perguntas'
import { Quadro } from '@/components/sections/Quadro'
import { SemPlano } from '@/components/sections/SemPlano'
import { BarraMobile } from '@/components/ui/BarraMobile'

/**
 * Proposta de site para a Clínica Saúde Campinas.
 *
 * A ordem persegue a decisão de quem chega sem plano de saúde procurando
 * atendimento, e não a apresentação da clínica:
 *
 *   promessa  →  o tamanho da operação  →  por que serve para você  →
 *   ACHAR o que você precisa  →  como agendar  →  quem responde pela clínica  →
 *   objeções  →  onde fica e o pedido.
 *
 * A diferença estrutural para o site atual está no quarto passo. Lá, as três
 * listas de atendimento moram em três páginas separadas e a home abre com dez
 * parágrafos de "Quem somos?"; aqui a lista inteira está na home, filtrável, e
 * cada linha é uma saída própria para o WhatsApp com o assunto já escrito.
 */
export default function Page() {
  return (
    <>
      <a className="pular" href="#quadro">
        Pular para o que a clínica atende
      </a>

      <Header />

      <main id="topo">
        <Hero />
        <Numeros />
        <SemPlano />
        <Quadro />
        <ComoFunciona />
        <AClinica />
        <Perguntas />
        <OndeFica />
      </main>

      <Footer />
      <BarraMobile />
    </>
  )
}
