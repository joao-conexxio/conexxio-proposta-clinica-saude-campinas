# Clínica Saúde Campinas — site

Site de página única da Clínica Saúde Campinas, com a identidade visual **Linha Azul**
(Guia de Identidade Visual Pró Clínica, 21/09/2026).

Ele é publicado como **HTML estático**: o build gera uma pasta `out/` com HTML, CSS,
JavaScript e imagens prontos. Não precisa de servidor Node, banco de dados nem
PHP. Qualquer hospedagem que sirva arquivos funciona.

- [Visão rápida](#visão-rápida)
- [Requisitos](#requisitos)
- [Rodar no computador](#rodar-no-computador)
- [Gerar a versão de produção](#gerar-a-versão-de-produção)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Publicar na hospedagem](#publicar-na-hospedagem)
- [Colocar no ar como site oficial](#colocar-no-ar-como-site-oficial)
- [Logotipo](#logotipo)
- [Editar textos e listas](#editar-textos-e-listas)
- [Identidade visual](#identidade-visual)
- [Movimento](#movimento)
- [Métricas e conversão](#métricas-e-conversão)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Pendências](#pendências)

---

## Visão rápida

| | |
|---|---|
| Framework | Next.js 15 (App Router) com `output: 'export'` → HTML estático |
| Linguagem | TypeScript + React 19 |
| Estilo | Um único CSS em `app/globals.css`, sem framework |
| Fonte | Figtree (Regular, Semibold, Bold), arquivo dentro do projeto (`app/fonts/`): o build não depende de rede e a página não chama o Google Fonts |
| Conteúdo | Todo em `content/lp.ts`. Nenhum texto fica espalhado pelos componentes |
| Saída | Pasta `out/`, cerca de 1 MB no total |
| Contato | Todas as saídas da página vão para o WhatsApp, com o assunto já escrito |

## Requisitos

- **Node.js 18.18 ou superior** (recomendado: 20 LTS ou 22 LTS)
- npm (vem com o Node)

Para conferir a versão instalada: `node -v`.

## Rodar no computador

```bash
npm ci          # instala as dependências (uma vez)
npm run dev     # abre em http://localhost:3000
```

Qualquer arquivo salvo recarrega a página sozinho.

## Gerar a versão de produção

```bash
npm run build   # gera a pasta out/
npm start       # (opcional) serve out/ em http://localhost:3000 para conferir
```

O conteúdo de `out/` é o site inteiro. É essa pasta que vai para a hospedagem.

Para conferir os tipos do código antes de publicar:

```bash
npm run typecheck
```

## Variáveis de ambiente

São todas opcionais e são lidas **no momento do build**: mudou uma variável,
rode `npm run build` de novo. Copie `.env.example` para `.env.local` e preencha,
ou defina as variáveis no painel da hospedagem (Netlify, Vercel etc.).

| Variável | Para que serve | Padrão |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Endereço público final, **com barra no fim**. Vira o canonical, o `og:url`, o JSON-LD e o sitemap. | URL da proposta no GitHub Pages |
| `NEXT_PUBLIC_BASE_PATH` | Subdiretório onde o site fica, **sem barra no fim**. Vazio = raiz do domínio. | vazio |
| `NEXT_PUBLIC_SITE_OFICIAL` | `true` quando este é o site oficial no ar. Libera a indexação no Google, publica o sitemap no `robots.txt` e tira o aviso de "proposta" do rodapé. | `false` |
| `NEXT_PUBLIC_GTM_ID` | ID do Google Tag Manager (`GTM-XXXXXXX`). Vazio = nenhuma tag é carregada. | vazio |

Exemplo de build do site oficial na raiz de um domínio:

```bash
NEXT_PUBLIC_SITE_URL=https://www.clinicasaudecampinas.com.br/ \
NEXT_PUBLIC_SITE_OFICIAL=true \
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX \
npm run build
```

Exemplo num subdiretório (`https://www.dominio.com.br/campinas/`):

```bash
NEXT_PUBLIC_SITE_URL=https://www.dominio.com.br/campinas/ \
NEXT_PUBLIC_BASE_PATH=/campinas \
NEXT_PUBLIC_SITE_OFICIAL=true \
npm run build
```

> **Atenção ao subdiretório:** se `NEXT_PUBLIC_BASE_PATH` não bater com a pasta
> real na hospedagem, a página abre sem estilo e sem imagens (404 nos arquivos de
> `_next/`).

## Publicar na hospedagem

### Hospedagem com painel de arquivos (Hostinger, Locaweb, KingHost, cPanel)

1. Rode o build com as variáveis do site oficial (acima).
2. Envie **o conteúdo** da pasta `out/` (não a pasta em si) para `public_html/`,
   ou para a subpasta correspondente ao `NEXT_PUBLIC_BASE_PATH`.
3. Abra o endereço e confira se o estilo e o logo carregaram.

Apache e LiteSpeed servem a estrutura de pastas sem nenhuma configuração extra.

### Netlify, Vercel ou Cloudflare Pages

| Campo | Valor |
|---|---|
| Comando de build | `npm run build` |
| Pasta publicada | `out` |
| Versão do Node | 20 ou 22 |

Cadastre as variáveis de ambiente no painel do serviço antes do primeiro deploy.

### Nginx

```nginx
location / {
  try_files $uri $uri/ $uri/index.html =404;
}
error_page 404 /404.html;
```

### GitHub Pages (proposta)

A proposta fica publicada em
`https://joao-conexxio.github.io/conexxio-proposta-clinica-saude-campinas/`,
servida pela branch `gh-pages`. Para gerar essa versão:

```bash
npm run build:proposta   # já define o subdiretório do repositório
```

e envie o conteúdo de `out/` (com um arquivo `.nojekyll` vazio) para a branch `gh-pages`.

**Versões em paralelo para comparação.** A `gh-pages` serve as três versões ao
mesmo tempo, cada uma na sua pasta:

| Versão | Endereço | Código | Build |
|---|---|---|---|
| Anterior (vinho) | `https://joao-conexxio.github.io/conexxio-proposta-clinica-saude-campinas/` | branch `main` | `npm run build:proposta` |
| Linha Azul (validada pela clínica) | `…/linha-azul/` | branch `identidade-linha-azul` | `npm run build:proposta:linha-azul` |
| Linha Azul viva (animações e mapa) | `…/linha-azul-viva/` | branch `linha-azul-viva` | `npm run build:proposta:viva` |

Para atualizar uma delas, rode o build correspondente e substitua **só a pasta
daquela versão** na `gh-pages` pelo conteúdo de `out/`. As outras não são
tocadas. Faça isso num clone separado da `gh-pages`: o build apaga a pasta
`out/` inteira, então ela nunca deve ser um repositório.

## Colocar no ar como site oficial

Antes de trocar o site atual por este:

- [ ] `NEXT_PUBLIC_SITE_URL` com o domínio definitivo e barra no fim
- [ ] `NEXT_PUBLIC_SITE_OFICIAL=true`
- [ ] Favicon com o símbolo oficial ([abaixo](#favicon))
- [ ] `NEXT_PUBLIC_GTM_ID` preenchido, se houver medição
- [ ] Depois do deploy: abrir `/robots.txt` e confirmar `Allow: /` e a linha do `Sitemap`
- [ ] No Google Search Console, enviar `https://SEU-DOMINIO/sitemap.xml`
- [ ] Testar um botão "Agendar" de cada grupo e confirmar que o WhatsApp abre com a mensagem certa

Sem `NEXT_PUBLIC_SITE_OFICIAL=true` o site continua com `noindex` e não aparece
no Google. Esse é o comportamento certo para a proposta e o errado para o site
oficial.

## Logotipo

O logo em uso é `public/brand/logo-clinica-saude-campinas.svg`, convertido do PDF
vetorizado que a clínica enviou em 04/11/2026. No PDF, o traço de baixo do "S"
vinha como uma imagem dentro de um recorte; no SVG ele virou preenchimento
vetorial com a mesma forma e a mesma cor (`#157AAE`, a do arquivo original).
Fora isso, nada foi alterado.

O guia de identidade exige o **arquivo oficial**, sem redesenhar, recolorir,
esticar ou aplicar efeito. O código respeita isso: o CSS só define a altura do
logo e nunca aplica filtro ou cor.

### Trocar o logotipo

1. Coloque o arquivo em `public/brand/` (SVG de preferência; PNG com pelo menos
   o dobro do tamanho exibido também serve). Um SVG usado como `<img>` precisa
   ser XML válido; se ele abrir quebrado no site e inteiro no navegador, é isso.
2. Em `content/lp.ts`, no objeto `site.logo`, atualize:
   ```ts
   logo: {
     src: '/brand/novo-logo.svg',
     largura: 1250,   // só a proporção do arquivo importa
     altura: 248,
   },
   ```
   `largura` e `altura` precisam ter a mesma proporção do arquivo. Elas servem
   para o navegador reservar o espaço certo antes da imagem carregar.
3. Se o novo logo for mais largo ou mais alto, ajuste a altura em
   `app/globals.css`:
   - `.cabecalho__marca img` → header (48px no desktop, 46px no celular)
   - `.rodape__marca img` → rodapé (56px, limitado à largura da coluna)

   Confira no tamanho real se o nome e o símbolo continuam legíveis, como pede
   o guia.

Header e rodapé têm fundo branco, que é a aplicação preferencial do guia.
**Não** coloque o logo sobre as áreas azuis da página.

### Favicon

O ícone da aba é um quadrado no Azul Pró Clínica com uma cruz branca, definido
em `app/layout.tsx` (`metadata.icons`). Ele não usa o "S" do logo porque o guia
proíbe separar os elementos do logotipo. Se a clínica tiver uma versão oficial
só do símbolo, salve-a como `app/icon.svg` (ou `app/icon.png`, 512×512), apague
a chave `icons` do `metadata` e o Next passa a usar o arquivo.

## Editar textos e listas

Todo o conteúdo está em **`content/lp.ts`**, separado por seção (hero, números,
quadro de especialidades, como funciona, a clínica, perguntas, onde fica, rodapé).

- `**trecho**` vira negrito na página.
- O **quadro de especialidades** (`GRUPOS`) é a lista exata do site atual da
  clínica. Cada item pode ter:
  - `nota`: complemento curto embaixo do nome (ex.: "aparelho")
  - `chaves`: palavras que a pessoa digita na busca e que não estão no nome
    (ex.: "dentista de criança" para Odontopediatria), **sem acento**
- As **perguntas frequentes** (`faq`) alimentam também o FAQ do Google (JSON-LD).
  Editou aqui, os dois mudam juntos.
- Telefone, endereço, redes e responsáveis técnicos ficam no objeto `site`, no
  topo do arquivo, e se repetem automaticamente em todo lugar.

**Regra de conteúdo:** numa página de saúde, só entra o que a clínica confirma.
Não acrescente especialidade, preço, horário ou convênio sem validar com ela.
O levantamento original está em `content/brief.md`.

## Identidade visual

Tudo está em `app/globals.css`, nos tokens do topo do arquivo.

| Token | Valor | Uso |
|---|---|---|
| `--azul` | `#1077AE` | **Cor principal** (guia): botões, destaques, faixa de números, seção da estrutura, cartão final |
| `--cinza` | `#808081` | **Cor complementar** (guia): filetes, numerais dos passos, elementos discretos |
| `--tinta` | `#23272B` | Títulos e texto principal |
| `--apoio` | `#575A5D` | Texto secundário |
| `--nevoa` | `#F3F5F7` | Fundo das seções claras alternadas |
| `--azul-escuro` | `#0D6595` | Só o hover dos botões. Não é cor institucional |

Por que o texto secundário não usa o Cinza oficial: `#808081` sobre branco tem
contraste de 3,9:1, abaixo do mínimo de 4,5:1 para texto pequeno (WCAG AA). O guia
pede para priorizar legibilidade, então o cinza oficial aparece onde é grande ou
gráfico, e o texto de apoio usa um neutro mais escuro.

Tipografia: **Figtree**, uma família só, nos três pesos do guia: Regular (400)
para texto de apoio, Semibold (600) para subtítulos e rótulos, Bold (700) para
títulos e CTA. Sem fonte serifada, sem monoespaçada e sem sombra ou contorno em
texto.

Não há verde nem vermelho na página. O ícone do WhatsApp herda a cor do botão.

Outras escolhas:
- **Acessibilidade:** contraste AA em todo texto, foco visível no teclado, link
  "Pular para o que a clínica atende", filtros com `aria-pressed` e resultado da
  busca anunciado ao leitor de tela.
- **Celular:** o menu some abaixo de 960px e uma barra fixa com "Agendar no
  WhatsApp" aparece abaixo de 640px.

## Movimento

As animações vêm do proposta-kit da Conexxio, portadas para componentes React
em `components/movimento/`, e foram ampliadas na versão "viva" pensando
primeiro no celular. A marcação declara e um componente só executa.

O guia pede visual "limpo, claro, profissional" e manda evitar excesso de
elementos e efeitos. Por isso o movimento segue um tema só, **a Linha Azul que
bate**: traços finos no azul oficial (o eletro, as formas, as ruas do mapa) e
nada aplicado ao logotipo.

| Peça | Onde | O que faz |
|---|---|---|
| Fundo vivo (`FundoVivo`) | hero, faixa de números, cartão final | Manchas da cor da marca fluindo em WebGL, seguindo o mouse ou o dedo. No hero são azuis bem diluídas sobre branco; nas faixas azuis, as manchas só **escurecem** o azul oficial, para o texto branco nunca perder contraste |
| Título palavra por palavra (`Palavras`) | H1 do hero | Sobe palavra por palavra no carregamento; o resto do hero entra em cascata |
| Monitor de eletro (`Ecg`) | hero | A linha se desenha uma vez e depois um trecho mais forte corre por ela sem parar, como num monitor cardíaco. No celular fica logo depois dos botões, para estar na primeira tela; no desktop atravessa a base do hero |
| Formas de fundo (`Formas`) | hero e faixa "A clínica" | Anéis, disco, dois arcos e a cruz pontilhada (arte `formas` do kit). Os arcos giram devagar e as formas andam mais devagar que a rolagem (`data-paralaxe`); no desktop seguem um pouco o mouse. No celular ficam no canto do título, sem o ponto que orbita |
| Fita (`sections/Fita`) | logo abaixo do hero | Faixa azul inclinada com tudo o que a clínica atende. Anda sozinha, acelera quando a pessoa rola e troca de sentido quando ela sobe a página |
| Texto que acende (`Acende` + `data-acende`) | "sem plano" e estrutura | O parágrafo acende palavra por palavra conforme a rolagem |
| Revelação (`data-reveal`) | títulos, itens, passos | Entra subindo ao chegar na tela, em cascata (`--d` em ms) |
| Quadro de especialidades (`sections/Quadro`) | lista | Ícone em cada atendimento; o destaque azul desliza entre os filtros; ao filtrar, os itens deslizam até o lugar novo. No celular os filtros ficam presos no topo enquanto a lista passa. A busca vale sempre para a lista inteira |
| Conversa que conduz os passos (`Conversa`) | "Como agendar" | Celular com uma conversa de WhatsApp: a mensagem é digitada na barra e enviada, a clínica aparece digitando e responde, os tiques ficam azuis. Cada passo acende junto (etiqueta dentro da conversa e, no desktop, a linha do tempo ao lado). Mensagens em `comoFunciona.conversa` (`content/lp.ts`), só com fatos publicados e com legenda de conversa ilustrativa |
| Mapa desenhado (`Mapa`) | "Onde fica" | As ruas reais do Centro em linhas finas, a R. Bernardino de Campos em azul e o pin no 927, que cai no lugar e pulsa. As ruas se desenham de dentro para fora quando a seção chega (`data-desenha`). O cartão inteiro abre o Google Maps |
| Inclinação e brilho (`data-tilt`, `data-glow`) | cartão do hero, itens do quadro | Seguem o cursor. Só no desktop: no toque, o efeito vem da rolagem e do fundo vivo |

Regras que valem para todas:
- **Só `transform` e `opacity`** (e o canvas do fundo vivo e o desenho único
  do mapa): nada recalcula layout. Medido com o processador do celular
  simulado 4x mais lento: 60 quadros por segundo na rolagem, nenhum travado.
- **O que é contínuo para fora da tela:** fundo vivo, conversa e fita só rodam
  enquanto estão visíveis.
- **Movimento reduzido:** quem ativa a opção no sistema vê tudo pronto e parado
  (eletro desenhado, fita parada, texto aceso, conversa inteira, mapa pronto).
- **Sem JavaScript, nada fica escondido:** todo estado inicial invisível está
  atrás da classe `.js`, que só existe com JavaScript ligado.

Para desligar uma peça, basta tirar o componente ou o atributo da marcação.

### Ícones

Os ícones de traço (`components/ui/icones-saude-dados.ts`) seguem a grade do
kit: 24×24, traço de 1,6, sem cor própria. Os de clínica geral, coração, olho e
outros vieram do `lib/icones-saude.mjs` do proposta-kit; os de odontologia,
exames e alguns órgãos foram desenhados aqui no mesmo traço. Cada item do
quadro escolhe o seu em `content/lp.ts` (campo `icone`).

### Mapa

O desenho fica em `content/mapa.ts`, **gerado** a partir do OpenStreetMap por
`ferramentas/gerar-mapa.mjs` (não editar à mão). O site não consulta nenhum
serviço de mapa ao abrir: é SVG dentro do HTML, sem cookie e sem requisição.

```bash
npm run mapa                                   # baixa as ruas de novo e regera
node ferramentas/gerar-mapa.mjs dados.json     # usa um arquivo já baixado
```

O centro é o pin da ficha da clínica no Google Maps (conferido em 06/11/2026).
Para outra unidade, troque `PIN` e os rótulos no topo do script. A licença dos
dados (ODbL) exige o crédito "© colaboradores do OpenStreetMap", que aparece
embaixo do mapa.

## Métricas e conversão

Com `NEXT_PUBLIC_GTM_ID` definido, o container do Google Tag Manager é carregado
e cada clique em botão de agendamento envia ao `dataLayer`:

```js
{ event: 'cta_click', cta_id: 'hero' }               // botão do topo
{ event: 'cta_click', cta_id: 'quadro:Dermatologista' } // linha do quadro
```

Valores de `cta_id`: `header`, `hero`, `quadro:<nome do item>`, `quadro-rodape`,
`como-funciona`, `fechamento`, `barra-mobile`.

No GTM, crie um acionador **Evento personalizado** com nome `cta_click` e use a
variável de camada de dados `cta_id` para mandar a conversão ao GA4 e ao Meta
Pixel. Se o `fbq` do Meta estiver na página, o código também dispara `Lead`
sozinho.

> O clique abre o WhatsApp com a mensagem pronta, mas a pessoa ainda precisa
> tocar em enviar. Nenhuma ferramenta do site enxerga esse último passo: compare
> os `cta_click` com as conversas que de fato chegam.

## Estrutura do projeto

```
app/
  layout.tsx        <head>: fonte, metadados, favicon, GTM, JSON-LD
  fonts/            Figtree (woff2) e a licença OFL
  page.tsx          ordem das seções
  globals.css       todo o visual (tokens no topo)
  robots.ts         robots.txt gerado conforme o modo (proposta/oficial)
  sitemap.ts        sitemap.xml
components/
  chrome/           Header e Footer
  movimento/        fundo vivo, eletro, formas, conversa, mapa, palavras e o orquestrador
  sections/         uma seção da página por arquivo
  ui/               botão de CTA, contador, ícones (inclusive os de saúde), barra mobile
content/
  lp.ts             TODO o conteúdo da página
  schema.ts         dados estruturados (JSON-LD) gerados a partir de lp.ts
  mapa.ts           desenho do Centro (GERADO por ferramentas/gerar-mapa.mjs)
  brief.md          levantamento do site atual da clínica (fonte do conteúdo)
ferramentas/
  gerar-mapa.mjs    baixa as ruas do OpenStreetMap e gera content/mapa.ts
hooks/              contagem dos números e barra de progresso do header
lib/
  asset.ts          prefixa o subdiretório em imagens de public/
  track.ts          eventos de conversão (dataLayer, gtag, fbq, Clarity)
public/brand/       logotipo
```

## Pendências

- **Horário de funcionamento:** não está publicado em lugar nenhum. Assim que a
  clínica confirmar, vale incluir na ficha do hero e no FAQ.
- **Telefone com DDD 11:** o WhatsApp `(11) 99300-7610` é o que está publicado no
  site atual, mas a clínica fica em Campinas (DDD 19). A ficha da clínica no
  Google Maps mostra um fixo, `(19) 2121-6601` (visto em 06/11/2026). Confirmar
  com a clínica qual número vai no site e se o fixo entra também.
- **Fotos:** a clínica vai fotografar fachada, consultórios e sala de espera.
  O lugar natural é o vazio da faixa "A clínica" no desktop (hoje ocupado pelas
  formas de fundo) e uma galeria; o proposta-kit tem a seção `galeria` pronta.

---

Desenvolvido pela [Conexxio](https://conexxio.com.br).
