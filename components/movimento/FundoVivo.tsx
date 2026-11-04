'use client'

import { useEffect, useRef } from 'react'

/**
 * Fundo vivo: manchas da cor da marca fluindo devagar e seguindo o ponteiro
 * (ou o dedo, no celular). Portado do `wow/fundo-vivo` do proposta-kit.
 *
 * WebGL num quad só, em resolução reduzida (são manchas desfocadas, não
 * precisam de cada pixel). As quatro cores vêm das variáveis `--vivo-*` do
 * elemento pai, então a mesma peça serve no hero claro e nas faixas azuis.
 *
 * Pausa fora da tela, pinta um quadro só sob movimento reduzido e, sem WebGL,
 * some e deixa o pai com a classe `vivo--estatico` (gradiente parado nas mesmas
 * cores, definido no CSS).
 *
 * O canvas não recebe eventos: quem escuta o ponteiro é o pai, em modo
 * passivo. Assim o dedo que rola a página nunca é capturado.
 */
const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'
const FS = `precision mediump float;
uniform vec2 r;uniform float t;uniform vec2 m;uniform vec3 bg,c1,c2,c3;
float b(vec2 p,vec2 c,float s){vec2 d=p-c;return exp(-dot(d,d)/s);}
void main(){
  vec2 uv=gl_FragCoord.xy/r;float a=r.x/r.y;vec2 p=vec2(uv.x*a,uv.y);
  p+=.06*vec2(sin(p.y*4.+t*.7),cos(p.x*4.+t*.6));
  vec3 col=bg;
  col=mix(col,c1,b(p,vec2(a*(.25+.2*sin(t*.31)),.78+.08*cos(t*.43)),.10));
  col=mix(col,c2,b(p,vec2(a*(.85+.12*cos(t*.27)),.52+.16*sin(t*.22)),.09));
  col=mix(col,c1,.6*b(p,vec2(a*(.5+.3*cos(t*.19)),.30+.1*sin(t*.37)),.07));
  col=mix(col,c3,.75*b(p,vec2(m.x*a,m.y),.035));
  float g=fract(sin(dot(gl_FragCoord.xy+fract(t)*91.,vec2(12.9898,78.233)))*43758.5453);
  col+=(g-.5)*.035;
  gl_FragColor=vec4(col,1.);
}`

export function FundoVivo() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const tela = ref.current
    const host = tela?.parentElement
    if (!tela || !host) return

    const gl = tela.getContext('webgl', {
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
    })
    if (!gl) {
      host.classList.add('vivo--estatico')
      tela.style.display = 'none'
      return
    }

    // Resolve a cor computada de uma variável. color-mix() serializa como
    // color(srgb r g b) em 0–1; cor simples, como rgb() em 0–255.
    const sonda = document.createElement('span')
    sonda.style.display = 'none'
    host.append(sonda)
    const cor = (nome: string): [number, number, number] => {
      sonda.style.color = `var(${nome})`
      const c = getComputedStyle(sonda).color
      const n = (c.match(/[\d.]+/g) || []).map(Number)
      const rgb = c.startsWith('color(') ? n.slice(0, 3) : n.slice(0, 3).map((v) => v / 255)
      return [rgb[0] ?? 0, rgb[1] ?? 0, rgb[2] ?? 0]
    }

    const shader = (tipo: number, src: string) => {
      const s = gl.createShader(tipo)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VS))
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FS))
    gl.linkProgram(prog)
    gl.useProgram(prog)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const U = (n: string) => gl.getUniformLocation(prog, n)
    gl.uniform3fv(U('bg'), cor('--vivo-bg'))
    gl.uniform3fv(U('c1'), cor('--vivo-1'))
    gl.uniform3fv(U('c2'), cor('--vivo-2'))
    gl.uniform3fv(U('c3'), cor('--vivo-3'))
    sonda.remove()

    const escala = Math.min(devicePixelRatio || 1, 1.5) * 0.6
    const ajustar = () => {
      tela.width = Math.max(1, Math.round(host.clientWidth * escala))
      tela.height = Math.max(1, Math.round(host.clientHeight * escala))
      gl.viewport(0, 0, tela.width, tela.height)
    }
    ajustar()

    let mx = 0.72
    let my = 0.6
    let tx = mx
    let ty = my
    let livre = true
    const seguir = (ev: PointerEvent) => {
      const r = host.getBoundingClientRect()
      tx = (ev.clientX - r.left) / r.width
      ty = 1 - (ev.clientY - r.top) / r.height
      livre = false
    }
    const soltar = () => {
      livre = true
    }
    host.addEventListener('pointermove', seguir, { passive: true })
    host.addEventListener('pointerdown', seguir, { passive: true })
    host.addEventListener('pointerleave', soltar, { passive: true })

    const t0 = performance.now()
    const pintar = (agora: number) => {
      const t = (agora - t0) / 1000
      if (livre) {
        tx = 0.62 + 0.24 * Math.sin(t * 0.4)
        ty = 0.6 + 0.15 * Math.cos(t * 0.33)
      }
      mx += (tx - mx) * 0.06
      my += (ty - my) * 0.06
      gl.uniform2f(U('r'), tela.width, tela.height)
      gl.uniform1f(U('t'), t)
      gl.uniform2f(U('m'), mx, my)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    const limpar = () => {
      host.removeEventListener('pointermove', seguir)
      host.removeEventListener('pointerdown', seguir)
      host.removeEventListener('pointerleave', soltar)
    }

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pintar(t0 + 4000)
      return limpar
    }

    let visivel = true
    let pedido = 0
    const laco = (agora: number) => {
      pintar(agora)
      pedido = visivel ? requestAnimationFrame(laco) : 0
    }
    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting
      if (visivel && !pedido) pedido = requestAnimationFrame(laco)
    })
    io.observe(host)
    addEventListener('resize', ajustar, { passive: true })
    pedido = requestAnimationFrame(laco)

    return () => {
      limpar()
      io.disconnect()
      removeEventListener('resize', ajustar)
      cancelAnimationFrame(pedido)
    }
  }, [])

  return <canvas className="vivo" ref={ref} aria-hidden />
}
