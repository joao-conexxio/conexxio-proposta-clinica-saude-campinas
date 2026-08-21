import { faq, quadro, site } from './lp'

/**
 * JSON-LD gerado a partir de `content/lp.ts`, nunca escrito à mão em paralelo.
 *
 * Duas regras que valem mais que qualquer ganho de SEO:
 *
 * 1. O schema só afirma o que a clínica publica. Não há `openingHours`,
 *    `priceRange` nem `aggregateRating` porque horário, preço e avaliação não
 *    existem em lugar nenhum do site dela. Schema inventado é o Google recebendo
 *    uma informação errada com selo de dado estruturado.
 * 2. As perguntas do FAQPage saem da mesma lista que a página renderiza, então
 *    não há como o schema e o texto divergirem.
 */

/** Remove a marcação `**negrito**` da copy antes de entrar no JSON-LD. */
function limpo(texto: string): string {
  return texto.replace(/\*\*/g, '')
}

const CLINICA_ID = `${site.url}#clinica`

export function buildJsonLd() {
  const clinica = {
    '@type': ['MedicalClinic', 'Dentist'],
    '@id': CLINICA_ID,
    name: site.nome,
    description: limpo(site.description),
    url: site.url,
    telephone: site.telefoneSchema,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.endereco,
      addressLocality: site.cidade,
      addressRegion: site.uf,
      addressCountry: site.pais,
    },
    areaServed: {
      '@type': 'City',
      name: site.cidade,
    },
    sameAs: [site.instagram, site.facebook],
    // Os responsáveis técnicos são o único dado de pessoa publicado, e vêm com
    // registro no conselho. Nenhum outro profissional é nomeado.
    employee: site.responsaveis.map((r) => ({
      '@type': 'Person',
      name: r.nome,
      jobTitle: 'Responsável técnico',
      identifier: r.registro,
    })),
    availableService: quadro.grupos.flatMap((grupo) =>
      grupo.itens.map((item) => ({
        '@type': grupo.id === 'exames' ? 'MedicalTest' : 'MedicalProcedure',
        name: item.nome,
        category: grupo.titulo,
      })),
    ),
  }

  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${site.url}#faq`,
    mainEntity: faq.itens.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: limpo(item.a) },
    })),
  }

  const webPage = {
    '@type': 'WebPage',
    '@id': site.url,
    url: site.url,
    name: site.title,
    description: limpo(site.description),
    inLanguage: 'pt-BR',
    about: { '@id': CLINICA_ID },
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [clinica, webPage, faqPage],
  }
}
