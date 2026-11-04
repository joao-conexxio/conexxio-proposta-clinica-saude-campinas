/**
 * Fonte única de conteúdo da página.
 *
 * Regra que vale para tudo aqui: só entra o que está em `content/brief.md`, que
 * é o levantamento do site atual da clínica. Preço, horário, convênio e
 * depoimento não aparecem em lugar nenhum do site dela, então não aparecem
 * aqui. O que falta está listado no fim do brief, para ser preenchido com o
 * cliente e não chutado.
 *
 * Convenção de copy: `**trecho**` vira <strong>. O negrito marca o que sustenta
 * o parágrafo, para a página ser legível em varredura.
 */

/**
 * Endereço público final. Vem do ambiente no build (ver `.env.example`); sem
 * ele, aponta para a proposta publicada no GitHub Pages.
 */
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://joao-conexxio.github.io/conexxio-proposta-clinica-saude-campinas/'
).replace(/\/?$/, '/')

/**
 * `true` quando o build é o site oficial no ar. Em modo proposta (o padrão) a
 * página fica fora do Google e o rodapé avisa que é uma proposta.
 */
export const SITE_OFICIAL = process.env.NEXT_PUBLIC_SITE_OFICIAL === 'true'

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim() || ''

export const site = {
  url: SITE_URL,
  origin: new URL(SITE_URL).origin,
  nome: 'Clínica Saúde Campinas',
  /**
   * Arquivo oficial do logotipo (vetor da Linha Azul, enviado pela clínica em
   * 04/11/2026). `largura` e `altura` guardam só a proporção do arquivo, para o
   * navegador reservar o espaço antes de carregar. O guia de identidade proíbe
   * recolorir, esticar ou remontar o logo, então o CSS só define a altura e
   * nunca aplica filtro.
   */
  logo: {
    src: '/brand/logo-clinica-saude-campinas.svg',
    largura: 1250,
    altura: 248,
  },
  title: 'Clínica Saúde Campinas · Consulta, exame e dentista no Centro de Campinas',
  description:
    'Clínica médica e odontológica popular no Centro de Campinas. Mais de 20 especialidades, exames e odontologia no mesmo endereço, com agendamento em até 15 dias. Atendimento particular, sem plano de saúde.',
  ogDescription:
    'Consulta, exame e dentista no mesmo endereço, no Centro de Campinas. Agendamento em até 15 dias, sem plano de saúde.',
  telefone: '(11) 99300-7610',
  telefoneHref: 'tel:+5511993007610',
  telefoneSchema: '+55-11-99300-7610',
  whatsappNumero: '5511993007610',
  endereco: 'R. Bernardino de Campos, 927',
  bairro: 'Centro',
  cidade: 'Campinas',
  uf: 'SP',
  pais: 'BR',
  mapaHref:
    'https://www.google.com/maps/search/?api=1&query=R.+Bernardino+de+Campos+927+Centro+Campinas+SP',
  instagram: 'https://www.instagram.com/clinicasaudecampinas',
  facebook: 'https://www.facebook.com/Clinicasaudecampinas',
  responsaveis: [
    { nome: 'Mariana Drjdrjan Jorge', registro: 'CRM 246006/SP', area: 'médica' },
    { nome: 'Victoria Machado de Oliveira', registro: 'CRO 127.184', area: 'odontológica' },
  ],
} as const

/**
 * Toda saída da página é o WhatsApp, e cada uma leva escrito o que a pessoa
 * veio buscar. No site atual os seis botões mandam a mesma frase genérica, o
 * que obriga a recepção a gastar a primeira troca de mensagens descobrindo o
 * assunto. Aqui o assunto vai junto com o clique.
 */
export function whatsapp(mensagem: string): string {
  return `https://wa.me/${site.whatsappNumero}?text=${encodeURIComponent(mensagem)}`
}

export const waGeral = whatsapp(
  `Olá! Vim pelo site e gostaria de agendar um atendimento na ${site.nome}.`,
)

/** Âncora do botão do header: leva ao quadro, não para fora da página. */
export const QUADRO_HREF = '#quadro'

export const nav = [
  { href: '#quadro', label: 'O que tem na clínica' },
  { href: '#como-funciona', label: 'Como agendar' },
  { href: '#a-clinica', label: 'A clínica' },
  { href: '#perguntas', label: 'Perguntas' },
  { href: '#onde-fica', label: 'Onde fica' },
] as const

/* ── HERO ─────────────────────────────────────────────────────────────── */

export const hero = {
  h1: 'Consulta, exame e dentista no mesmo endereço.',
  lead:
    'Clínica médica e odontológica popular no Centro de Campinas. Você marca **sem plano de saúde**, é atendido **em até 15 dias** e resolve consulta, exame e tratamento no mesmo lugar, sem correr a cidade inteira.',
  ctaPrimario: 'Agendar no WhatsApp',
  ctaSecundario: 'Ver o que a clínica atende',
  ficha: {
    titulo: 'A clínica',
    linhas: [
      { rotulo: 'Endereço', valor: 'R. Bernardino de Campos, 927, Centro, Campinas' },
      { rotulo: 'WhatsApp', valor: '(11) 99300-7610' },
      { rotulo: 'Atendimento', valor: 'Particular, sem plano de saúde' },
      { rotulo: 'Prazo para agendar', valor: 'Até 15 dias' },
    ],
    responsaveisRotulo: 'Responsáveis técnicos',
  },
} as const

/* ── FAIXA DE NÚMEROS ─────────────────────────────────────────────────── */

/**
 * Os quatro números que a clínica publica. Nenhum é estimativa: todos saem do
 * texto do site atual, onde estão soltos no meio de parágrafos corridos.
 */
export const numeros = {
  titulo: 'O que cabe num endereço só',
  itens: [
    { count: 20, prefix: '+', display: '+20', legenda: 'médicos especialistas' },
    { count: 150, prefix: '+', display: '+150', legenda: 'procedimentos odontológicos' },
    { count: 3000, prefix: '+', group: true, display: '+3.000', legenda: 'tipos de exame de laboratório' },
    { count: 15, display: '15', legenda: 'dias, o prazo máximo para ser atendido' },
  ],
} as const

/* ── SEM PLANO ────────────────────────────────────────────────────────── */

export const semPlano = {
  titulo: 'Você não precisa de plano de saúde para ser bem atendido.',
  texto:
    'A clínica nasceu para atender quem não tem convênio e não quer esperar meses por um encaminhamento. **O atendimento é particular e com preço popular**, feito por especialistas, com estrutura própria de exames.',
  pontos: [
    {
      titulo: 'Sem fila de espera longa',
      texto: 'O prazo máximo de agendamento é de 15 dias, para qualquer especialidade.',
    },
    {
      titulo: 'Sem correr a cidade',
      texto:
        'Consulta, coleta de exame, ultrassom e dentista ficam no mesmo endereço, no Centro.',
    },
    {
      titulo: 'Sem começar do zero de novo',
      texto:
        'Quem atende antes do procedimento é quem acompanha depois: pré e pós-operatório na mesma clínica.',
    },
  ],
} as const

/* ── QUADRO DE ESPECIALIDADES (seção principal) ───────────────────────── */

/**
 * O coração da página. No site atual estas três listas moram em três páginas
 * separadas, então quem chega procurando "dermatologista em Campinas" não
 * encontra a palavra na home. Aqui elas ficam juntas, filtráveis, e cada linha
 * abre o WhatsApp já dizendo qual especialidade a pessoa quer.
 *
 * As listas são exatamente as do site dela. Não acrescentar nada sem confirmar
 * com a clínica: prometer especialidade que não existe é o pior erro possível
 * numa página de saúde.
 */
export type ItemQuadro = {
  nome: string
  nota?: string
  /**
   * Palavras que a pessoa realmente digita, e que não estão no nome técnico:
   * ninguém procura "odontopediatria", procura "dentista de criança". Só entram
   * sinônimos do que a clínica já oferece, nunca serviço novo.
   */
  chaves?: string
}
export type GrupoQuadro = {
  id: string
  label: string
  titulo: string
  resumo: string
  itens: readonly ItemQuadro[]
}

const GRUPOS: readonly GrupoQuadro[] = [
  {
    id: 'medicina',
    label: 'Medicina',
    titulo: 'Especialidades médicas',
    resumo: 'Mais de 20 especialistas atendendo no Centro de Campinas.',
    itens: [
      { nome: 'Clínico geral', chaves: 'consulta geral checkup atestado' },
      { nome: 'Cardiologista', chaves: 'coracao cardio pressao' },
      { nome: 'Dermatologista', chaves: 'pele mancha acne cabelo unha' },
      { nome: 'Endocrinologista', chaves: 'tireoide diabetes hormonio peso' },
      { nome: 'Ginecologista', chaves: 'mulher preventivo utero gravidez' },
      { nome: 'Nutricionista', chaves: 'dieta alimentacao emagrecer' },
      { nome: 'Oftalmologista', chaves: 'olho vista oculos grau' },
      { nome: 'Ortopedista', chaves: 'osso coluna joelho fratura dor' },
      { nome: 'Otorrinolaringologista', chaves: 'otorrino ouvido garganta nariz sinusite' },
      { nome: 'Pediatra', chaves: 'crianca bebe filho' },
      { nome: 'Psicólogo', chaves: 'terapia ansiedade psicologia' },
      { nome: 'Psiquiatra', chaves: 'depressao ansiedade saude mental' },
      { nome: 'Urologista', chaves: 'homem prostata rim urina' },
      { nome: 'Vascular', chaves: 'varizes circulacao veia perna' },
    ],
  },
  {
    id: 'odontologia',
    label: 'Odontologia',
    titulo: 'Odontologia',
    resumo: 'Mais de 150 procedimentos, do clínico geral ao implante.',
    itens: [
      { nome: 'Dentista clínico geral', chaves: 'dentista limpeza restauracao carie canal' },
      { nome: 'Implante dentário', chaves: 'dentista implante dente perdido' },
      { nome: 'Prótese', chaves: 'dentista dentadura ponte coroa' },
      { nome: 'Ortodontia', nota: 'aparelho', chaves: 'dentista aparelho dente torto' },
      { nome: 'Odontopediatria', nota: 'crianças', chaves: 'dentista crianca bebe filho' },
    ],
  },
  {
    id: 'exames',
    label: 'Exames',
    titulo: 'Exames e diagnóstico',
    resumo: 'Coleta e laudo na própria clínica, sem encaminhamento para fora.',
    itens: [
      { nome: 'Exames de laboratório', nota: 'mais de 3 mil tipos', chaves: 'sangue urina fezes coleta colesterol glicose' },
      { nome: 'Ultrassonografia', chaves: 'ultrassom usg gravidez abdome' },
      { nome: 'Raio-X', chaves: 'raio x radiografia osso torax' },
      { nome: 'Tomografia', chaves: 'tomo imagem' },
      { nome: 'Eletrocardiograma', chaves: 'ecg eletro coracao' },
      { nome: 'Ecocardiograma', chaves: 'eco coracao ultrassom do coracao' },
      { nome: 'Holter 24 horas', chaves: 'coracao batimento monitor' },
      { nome: 'MAPA 24 horas', chaves: 'pressao arterial monitor' },
      { nome: 'Sexagem fetal', chaves: 'sexo do bebe gravidez menino menina' },
      { nome: 'Teste de DNA', chaves: 'paternidade exame genetico' },
    ],
  },
]

export const quadro = {
  titulo: 'Procure o que você precisa e agende direto.',
  lead:
    'Escolha a especialidade, o exame ou o tratamento. O botão abre o WhatsApp **já com o assunto escrito**, então a recepção sabe do que se trata antes de você digitar.',
  todosLabel: 'Tudo',
  buscaLabel: 'Buscar especialidade, exame ou tratamento',
  buscaPlaceholder: 'ex.: dermatologista, ultrassom',
  vazio:
    'Nada encontrado com esse termo. Pergunte no WhatsApp: a agenda tem mais opções do que cabe nesta lista.',
  contagem: (n: number) => (n === 1 ? '1 opção' : `${n} opções`),
  agendarRotulo: 'Agendar',
  rodapeNota:
    'A lista traz o que está publicado. Se o que você precisa não aparecer, a recepção confirma pelo WhatsApp.',
  grupos: GRUPOS,
} as const

/* ── COMO FUNCIONA ────────────────────────────────────────────────────── */

/**
 * Numerado porque é uma sequência de verdade: cada passo depende do anterior. É
 * o único lugar da página com numeração.
 */
export const comoFunciona = {
  titulo: 'Três passos, e nenhum deles é presencial.',
  passos: [
    {
      titulo: 'Diga o que você precisa',
      texto:
        'Mande mensagem no WhatsApp com a especialidade ou o exame. Se não souber o nome, descreva o sintoma que a recepção orienta.',
    },
    {
      titulo: 'Escolha o dia',
      texto:
        'A recepção volta com as datas disponíveis. O prazo máximo é de 15 dias, e normalmente é bem menos.',
    },
    {
      titulo: 'Venha uma vez só',
      texto:
        'Consulta, coleta de exame e retorno acontecem no mesmo endereço. Quando dá, tudo no mesmo dia.',
    },
  ],
  cta: 'Começar pelo WhatsApp',
  ctaMensagem:
    'Olá! Vim pelo site e gostaria de agendar. Preciso de:',
  /**
   * Conversa ilustrativa do celular ao lado dos passos. A primeira mensagem é
   * exatamente a que o botão "Agendar" do quadro deixa pronta; as respostas só
   * repetem o que a clínica publica (prazo de até 15 dias, consulta e exame no
   * mesmo endereço). Nada de horário ou preço, que não estão publicados.
   */
  conversa: [
    { de: 'paciente', texto: 'Olá! Vim pelo site e gostaria de agendar: Cardiologista.' },
    { de: 'clinica', texto: 'Olá! Vamos agendar, sim. Prefere manhã ou tarde?' },
    { de: 'paciente', texto: 'De manhã. E o eletro, faço aí também?' },
    {
      de: 'clinica',
      texto: 'Faz, sim: o eletrocardiograma é feito aqui mesmo. Já te mando as datas, em até 15 dias.',
    },
  ],
  conversaLegenda: 'Conversa ilustrativa. O assunto já chega escrito quando você toca em “Agendar”.',
} as const

/* ── A CLÍNICA ────────────────────────────────────────────────────────── */

export const aClinica = {
  titulo: 'Uma clínica inteira, não uma sala de consulta.',
  texto:
    'A unidade do Centro reúne consultórios, laboratório de coleta próprio e sala de imagem. É isso que permite **resolver num endereço só** o que normalmente exige três agendamentos em três lugares diferentes.',
  itens: [
    'Consultórios para mais de 20 especialidades médicas',
    'Laboratório próprio para coleta de exames',
    'Sala de ultrassonografia, raio-X e tomografia',
    'Consultórios odontológicos com mais de 150 procedimentos',
    'Acompanhamento pré e pós-operatório na mesma clínica',
  ],
  responsaveisTitulo: 'Quem responde tecnicamente pela clínica',
  responsaveisNota:
    'Registro profissional é o que separa clínica de improviso. Os dois responsáveis técnicos estão registrados nos conselhos e respondem pelo atendimento médico e odontológico.',
} as const

/* ── PERGUNTAS ────────────────────────────────────────────────────────── */

/**
 * Toda resposta aqui é sustentada pelo site atual da clínica. Nenhuma fala de
 * preço, horário ou convênio, porque nenhuma dessas informações está publicada.
 * O JSON-LD de FAQPage é gerado desta lista, então editar aqui atualiza os dois.
 */
export const faq = {
  titulo: 'O que costumam perguntar.',
  itens: [
    {
      q: 'Preciso ter plano de saúde?',
      a: 'Não. O atendimento é particular, com preço popular. A clínica foi montada justamente para quem não tem convênio.',
    },
    {
      q: 'Quanto tempo até eu conseguir a consulta?',
      a: 'O prazo máximo de agendamento é de **15 dias**, para qualquer especialidade. Na maioria dos casos é bem antes disso.',
    },
    {
      q: 'Consigo fazer o exame no mesmo lugar da consulta?',
      a: 'Sim. A clínica tem laboratório de coleta próprio e sala de imagem, então consulta, exame e retorno acontecem no mesmo endereço.',
    },
    {
      q: 'Vocês fazem exame de sangue?',
      a: 'Sim, mais de 3 mil tipos de exame de laboratório, além de ultrassom, raio-X, tomografia e exames de coração como eletrocardiograma, ecocardiograma, Holter e MAPA de 24 horas.',
    },
    {
      q: 'Atende criança?',
      a: 'Sim, com pediatra na parte médica e odontopediatria na parte odontológica.',
    },
    {
      q: 'Quem responde pela clínica?',
      // Montada da lista `site.responsaveis`: trocar um RT ali atualiza esta
      // resposta, a ficha, a seção da estrutura, o rodapé e o JSON-LD juntos.
      a: `Os responsáveis técnicos são ${site.responsaveis
        .map((r) => `**${r.nome}, ${r.registro}**, pela parte ${r.area}`)
        .join(', e ')}.`,
    },
    {
      q: 'Como eu agendo?',
      a: 'Pelo WhatsApp **(11) 99300-7610**. Diga a especialidade ou o exame que você precisa e a recepção responde com as datas.',
    },
  ],
} as const

/* ── ONDE FICA / CTA FINAL ────────────────────────────────────────────── */

export const ondeFica = {
  titulo: 'No Centro de Campinas.',
  // Sem repetir o endereço: ele aparece logo abaixo, como campo de ficha.
  texto: 'A mesma porta serve para consulta, para exame e para o dentista.',
  mapaRotulo: 'Abrir no Google Maps',
  cta: {
    titulo: 'Vamos marcar?',
    texto:
      'Mande uma mensagem dizendo do que você precisa. Se não souber o nome da especialidade, conte o que está sentindo que a recepção orienta.',
    botao: 'Agendar no WhatsApp',
    telefoneRotulo: 'ou ligue',
  },
} as const

/* ── RODAPÉ ───────────────────────────────────────────────────────────── */

export const footer = {
  descricao:
    'Clínica médica e odontológica popular no Centro de Campinas. Consultas, exames e odontologia no mesmo endereço.',
  colunas: [
    {
      titulo: 'Atendimento',
      links: [
        { label: 'Especialidades médicas', href: '#quadro' },
        { label: 'Odontologia', href: '#quadro' },
        { label: 'Exames e diagnóstico', href: '#quadro' },
        { label: 'Como agendar', href: '#como-funciona' },
      ],
    },
    {
      titulo: 'A clínica',
      links: [
        { label: 'Estrutura', href: '#a-clinica' },
        { label: 'Perguntas frequentes', href: '#perguntas' },
        { label: 'Onde fica', href: '#onde-fica' },
      ],
    },
  ],
  redesTitulo: 'Redes',
  /**
   * Marca de autoria. É a ÚNICA menção à Conexxio na página: em qualquer outro
   * lugar seria resíduo do template. No modo proposta ela vem acompanhada do
   * aviso; no site oficial fica só o crédito.
   */
  assinatura: SITE_OFICIAL ? 'Site desenvolvido pela Conexxio' : 'Proposta de site pela Conexxio',
  assinaturaNota: SITE_OFICIAL
    ? ''
    : 'Esta é uma proposta de site, não o site oficial da clínica. As informações foram levantadas do site atual em agosto de 2026.',
} as const
