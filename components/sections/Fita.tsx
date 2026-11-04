import { quadro } from '@/content/lp'

/**
 * Faixa azul inclinada com tudo o que a clínica atende, correndo em loop logo
 * abaixo do hero. Portada da seção `fita` do proposta-kit.
 *
 * Decorativa: a mesma lista está inteira no quadro, então a fita sai do leitor
 * de tela. Vai duas vezes para o loop não ter emenda. A caixa de fora só corta
 * na horizontal; sem esse corte, a faixa girada passa da tela e o celular anda
 * de lado.
 */
const nomes = quadro.grupos.flatMap((g) => g.itens.map((item) => item.nome))

export function Fita() {
  const itens = nomes.map((n) => <li key={n}>{n}</li>)
  return (
    <div className="fita" aria-hidden>
      <div className="fita__faixa">
        <div className="fita__trilho">
          <ul>{itens}</ul>
          <ul>{itens}</ul>
        </div>
      </div>
    </div>
  )
}
