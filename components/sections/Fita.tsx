'use client'

import { useEffect, useRef } from 'react'
import { quadro } from '@/content/lp'

/**
 * Faixa azul inclinada com tudo o que a clínica atende, correndo em loop logo
 * abaixo do hero. Portada da seção `fita` do proposta-kit.
 *
 * Ela responde à rolagem: anda devagar sozinha, acelera quando a pessoa rola e
 * troca de sentido quando ela sobe a página. Só `transform`, num quadro por
 * vez, e só enquanto a faixa está na tela. Sem JavaScript ela corre pela
 * animação do CSS; com movimento reduzido fica parada.
 *
 * Decorativa: a mesma lista está inteira no quadro, então a fita sai do leitor
 * de tela. Vai duas vezes para o loop não ter emenda. A caixa de fora só corta
 * na horizontal; sem esse corte, a faixa girada passa da tela e o celular anda
 * de lado.
 */
const nomes = quadro.grupos.flatMap((g) => g.itens.map((item) => item.nome))

/** Uma volta completa (a lista inteira) a cada tantos segundos, como no CSS. */
const SEGUNDOS_POR_VOLTA = 60

export function Fita() {
  const fita = useRef<HTMLDivElement>(null)
  const trilho = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const caixa = fita.current
    const t = trilho.current
    if (!caixa || !t || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    caixa.classList.add('fita--viva')

    let volta = t.scrollWidth / 2
    let x = 0
    let cruzeiro = volta / SEGUNDOS_POR_VOLTA
    let v = cruzeiro
    let sentido = 1
    let impulso = 0
    let ultimoY = scrollY
    let antes = performance.now()
    let pedido = 0
    let visivel = false

    const quadroAQuadro = (agora: number) => {
      const dt = Math.min(0.05, (agora - antes) / 1000)
      antes = agora
      impulso *= 0.9
      const alvo = sentido * cruzeiro + impulso
      v += (alvo - v) * 0.1
      x -= v * dt
      if (x <= -volta) x += volta
      if (x > 0) x -= volta
      t.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`
      pedido = visivel ? requestAnimationFrame(quadroAQuadro) : 0
    }

    const aoRolar = () => {
      const y = scrollY
      const delta = y - ultimoY
      ultimoY = y
      if (delta !== 0) sentido = delta > 0 ? 1 : -1
      impulso = Math.max(-900, Math.min(900, impulso + delta * 6))
    }
    const aoRedimensionar = () => {
      volta = t.scrollWidth / 2
      cruzeiro = volta / SEGUNDOS_POR_VOLTA
    }

    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting
      if (visivel && !pedido) {
        antes = performance.now()
        pedido = requestAnimationFrame(quadroAQuadro)
      }
    })
    io.observe(caixa)
    addEventListener('scroll', aoRolar, { passive: true })
    addEventListener('resize', aoRedimensionar, { passive: true })
    document.fonts?.ready.then(aoRedimensionar)

    return () => {
      io.disconnect()
      cancelAnimationFrame(pedido)
      removeEventListener('scroll', aoRolar)
      removeEventListener('resize', aoRedimensionar)
      caixa.classList.remove('fita--viva')
    }
  }, [])

  const itens = nomes.map((n) => <li key={n}>{n}</li>)
  return (
    <div className="fita" aria-hidden ref={fita}>
      <div className="fita__faixa">
        <div className="fita__trilho" ref={trilho}>
          <ul>{itens}</ul>
          <ul>{itens}</ul>
        </div>
      </div>
    </div>
  )
}
