#!/usr/bin/env node
/**
 * Gera `content/mapa.ts`: o desenho do Centro de Campinas em volta da clínica,
 * a partir das ruas do OpenStreetMap (© colaboradores do OpenStreetMap,
 * licença ODbL — o crédito aparece embaixo do mapa, na página).
 *
 * Roda uma vez, à mão; o site não consulta nada em tempo real. Para refazer
 * (outra unidade, outro endereço, ruas novas no OSM):
 *
 *   node ferramentas/gerar-mapa.mjs                 # baixa do Overpass
 *   node ferramentas/gerar-mapa.mjs dados.json      # usa um arquivo já baixado
 *
 * O ponto central é o pin da ficha da clínica no Google Maps (conferido em
 * 06/11/2026): R. Bernardino de Campos, 927, a 5 m da rua no OSM e a 15 m da
 * esquina com a R. Regente Feijó.
 *
 * Projeção: metros em volta do pin (x para leste, y para o sul), boa o
 * bastante para meio quilômetro. 1 unidade do SVG = 1 metro.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PIN = { lat: -22.9037386, lon: -47.061262 }
/** Metade da largura e da altura do recorte, em metros. */
const MEIO_X = 360
const MEIO_Y = 270
const FOLGA = 30
const DESTAQUE = 'Rua Bernardino de Campos'
const ROTULOS = [
  // `onde`: posição do texto ao longo da rua (o pin fica no meio da Bernardino).
  { rua: 'Rua Bernardino de Campos', texto: 'R. Bernardino de Campos', onde: '34%' },
  { rua: 'Rua Regente Feijó', texto: 'R. Regente Feijó' },
  { rua: 'Avenida Francisco Glicério', texto: 'Av. Francisco Glicério' },
]

const CLASSES = {
  trunk: 'av',
  trunk_link: 'av',
  primary: 'av',
  primary_link: 'av',
  secondary: 'rp',
  secondary_link: 'rp',
  tertiary: 'rp',
  tertiary_link: 'rp',
  residential: 'r',
  unclassified: 'r',
  living_street: 'r',
  pedestrian: 'p',
}

const QUERY = `[out:json][timeout:60];(
way["highway"~"^(${Object.keys(CLASSES).join('|')})$"](around:700,${PIN.lat},${PIN.lon});
way["leisure"~"^(park|garden)$"](around:700,${PIN.lat},${PIN.lon});
way["place"="square"](around:700,${PIN.lat},${PIN.lon});
);out geom;`

const SERVIDORES = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
]

async function baixar() {
  for (const url of SERVIDORES) {
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'user-agent': 'conexxio-site-builder/1.0' },
        body: new URLSearchParams({ data: QUERY }),
      })
      if (r.ok) return await r.json()
      console.warn(`${url}: ${r.status}`)
    } catch (e) {
      console.warn(`${url}: ${e.message}`)
    }
  }
  throw new Error('Nenhum servidor Overpass respondeu. Tente de novo em alguns minutos.')
}

const kx = Math.cos((PIN.lat * Math.PI) / 180) * 111320
const ky = 110574
const projetar = (g) => [(g.lon - PIN.lon) * kx, -(g.lat - PIN.lat) * ky]

const caixa = { x0: -MEIO_X - FOLGA, x1: MEIO_X + FOLGA, y0: -MEIO_Y - FOLGA, y1: MEIO_Y + FOLGA }

/** Recorte de segmento (Liang–Barsky): devolve o trecho dentro da caixa ou null. */
function recortar(a, b) {
  let t0 = 0
  let t1 = 1
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const testes = [
    [-dx, a[0] - caixa.x0],
    [dx, caixa.x1 - a[0]],
    [-dy, a[1] - caixa.y0],
    [dy, caixa.y1 - a[1]],
  ]
  for (const [p, q] of testes) {
    if (p === 0) {
      if (q < 0) return null
      continue
    }
    const r = q / p
    if (p < 0) {
      if (r > t1) return null
      if (r > t0) t0 = r
    } else {
      if (r < t0) return null
      if (r < t1) t1 = r
    }
  }
  return [
    [a[0] + t0 * dx, a[1] + t0 * dy],
    [a[0] + t1 * dx, a[1] + t1 * dy],
    t0 > 0,
    t1 < 1,
  ]
}

/** Polilinha recortada pela caixa: pode virar vários trechos. */
function trechos(pts) {
  const saida = []
  let atual = null
  for (let i = 1; i < pts.length; i++) {
    const r = recortar(pts[i - 1], pts[i])
    if (!r) {
      atual = null
      continue
    }
    const [a, b, cortouInicio, cortouFim] = r
    if (!atual || cortouInicio) {
      atual = [a]
      saida.push(atual)
    }
    atual.push(b)
    if (cortouFim) atual = null
  }
  return saida.filter((t) => t.length > 1)
}

const n = (v) => Math.round(v)
const caminho = (pts, fechar = false) =>
  pts.map((p, i) => `${i ? 'L' : 'M'}${n(p[0])} ${n(p[1])}`).join('') + (fechar ? 'Z' : '')

const distanciaAoPin = (pts) => Math.min(...pts.map((p) => Math.hypot(p[0], p[1])))

/** Junta os trechos de uma rua que se encostam ponta com ponta. */
function emendar(lista) {
  const restantes = lista.map((t) => [...t])
  const linhas = []
  while (restantes.length) {
    let linha = restantes.shift()
    let mudou = true
    while (mudou) {
      mudou = false
      for (let i = 0; i < restantes.length; i++) {
        const t = restantes[i]
        const perto = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 1.5
        if (perto(linha.at(-1), t[0])) linha = [...linha, ...t.slice(1)]
        else if (perto(linha.at(-1), t.at(-1))) linha = [...linha, ...[...t].reverse().slice(1)]
        else if (perto(linha[0], t.at(-1))) linha = [...t, ...linha.slice(1)]
        else if (perto(linha[0], t[0])) linha = [...[...t].reverse(), ...linha.slice(1)]
        else continue
        restantes.splice(i, 1)
        mudou = true
        break
      }
    }
    linhas.push(linha)
  }
  return linhas
}

const comprimento = (pts) =>
  pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0)

const arquivo = process.argv[2]
const dados = arquivo ? JSON.parse(readFileSync(arquivo, 'utf8')) : await baixar()

const vias = []
const destaque = []
const areas = []
const porRua = new Map()

for (const el of dados.elements) {
  if (!el.geometry) continue
  const pts = el.geometry.map(projetar)
  const t = el.tags ?? {}
  const area =
    t.leisure === 'park' || t.leisure === 'garden' || t.place === 'square' || t.area === 'yes'
  if (area) {
    const dentro = pts.some((p) => Math.abs(p[0]) < MEIO_X + FOLGA && Math.abs(p[1]) < MEIO_Y + FOLGA)
    if (dentro && pts.length > 3) areas.push(caminho(pts, true))
    continue
  }
  const classe = CLASSES[t.highway]
  if (!classe) continue
  for (const trecho of trechos(pts)) {
    const atraso = Math.round(Math.min(1, distanciaAoPin(trecho) / 420) * 900)
    if (t.name === DESTAQUE) destaque.push({ d: caminho(trecho), atraso })
    else vias.push({ d: caminho(trecho), c: classe, atraso })
    if (ROTULOS.some((r) => r.rua === t.name)) {
      if (!porRua.has(t.name)) porRua.set(t.name, [])
      porRua.get(t.name).push(trecho)
    }
  }
}

/**
 * Rótulo ao longo da rua: o trecho emendado mais longo, desenhado sempre da
 * esquerda para a direita (para o texto não sair de cabeça para baixo), com
 * o texto no meio do trecho.
 */
const rotulos = []
for (const { rua, texto, onde = '50%' } of ROTULOS) {
  const linhas = emendar(porRua.get(rua) ?? [])
  if (!linhas.length) {
    console.warn(`sem trecho para rotular: ${rua}`)
    continue
  }
  let linha = linhas.sort((a, b) => comprimento(b) - comprimento(a))[0]
  if (linha[0][0] > linha.at(-1)[0]) linha = [...linha].reverse()
  rotulos.push({ id: `rua-${rotulos.length}`, d: caminho(linha), texto, onde })
}

vias.sort((a, b) => a.atraso - b.atraso)

const saida = `/**
 * Desenho do Centro de Campinas em volta da clínica. GERADO por
 * \`ferramentas/gerar-mapa.mjs\` a partir do OpenStreetMap
 * (© colaboradores do OpenStreetMap, ODbL). Não editar à mão: rode o script.
 *
 * 1 unidade = 1 metro; o pin da clínica é o ponto (0, 0), no centro da caixa.
 * \`c\`: av = avenida, rp = rua principal, r = rua, p = calçadão.
 * \`atraso\`: em ms, cresce com a distância ao pin, para as ruas se
 * desenharem de dentro para fora.
 */
export const mapa = ${JSON.stringify(
  {
    caixa: `${-MEIO_X} ${-MEIO_Y} ${MEIO_X * 2} ${MEIO_Y * 2}`,
    areas,
    vias,
    destaque,
    rotulos,
  },
  null,
  1,
)} as const
`

const destino = join(dirname(fileURLToPath(import.meta.url)), '..', 'content', 'mapa.ts')
writeFileSync(destino, saida)
console.log(
  `content/mapa.ts: ${vias.length} vias, ${destaque.length} trechos em destaque, ${areas.length} áreas, ${rotulos.length} rótulos, ${(saida.length / 1024).toFixed(1)} KB`,
)
