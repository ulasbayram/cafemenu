'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

type Currency = 'USD' | 'TRY'

function getStoredCurrency(): Currency {
  if (typeof window === 'undefined') return 'USD'
  const v = window.localStorage.getItem('currency')
  return v === 'TRY' ? 'TRY' : 'USD'
}

export function CurrencySelector() {
  const [currency, setCurrency] = useState<Currency>('USD')
  useEffect(() => { setCurrency(getStoredCurrency()) }, [])

  const set = (next: Currency) => {
    setCurrency(next)
    try { window.localStorage.setItem('currency', next) } catch {}
    const ev = new CustomEvent('currency-change', { detail: { currency: next } })
    window.dispatchEvent(ev)
  }

  return (
    <div className="inline-flex items-center gap-1">
      <Button size="sm" variant={currency === 'USD' ? 'default' : 'outline'} onClick={() => set('USD')}>USD</Button>
      <Button size="sm" variant={currency === 'TRY' ? 'default' : 'outline'} onClick={() => set('TRY')}>TRY</Button>
    </div>
  )
}

export function Price({ valueUsd }: { valueUsd: number | null | undefined }) {
  const [currency, setCurrency] = useState<Currency>(getStoredCurrency())
  const [rate, setRate] = useState<number>(() => {
    if (typeof window === 'undefined') return Number(process.env.NEXT_PUBLIC_TRY_PER_USD) || 35
    const fromEnv = Number(process.env.NEXT_PUBLIC_TRY_PER_USD)
    const fromStorage = Number(window.localStorage.getItem('exchange_rate_try_per_usd') || '')
    return (Number.isFinite(fromStorage) && fromStorage > 0 ? fromStorage : (Number.isFinite(fromEnv) && fromEnv > 0 ? fromEnv : 35))
  })

  useEffect(() => {
    const onChange = (e: any) => setCurrency(e.detail?.currency === 'TRY' ? 'TRY' : 'USD')
    window.addEventListener('currency-change', onChange as any)
    const onRate = (e: any) => {
      const next = Number(e.detail?.rate)
      if (Number.isFinite(next) && next > 0) setRate(next)
    }
    window.addEventListener('currency-rate-change', onRate as any)
    return () => {
      window.removeEventListener('currency-change', onChange as any)
      window.removeEventListener('currency-rate-change', onRate as any)
    }
  }, [])

  if (currency === 'TRY') {
    const v = (valueUsd ?? 0) * rate
    return <span className="font-semibold whitespace-nowrap">₺ {v.toFixed(2)}</span>
  }
  return <span className="font-semibold whitespace-nowrap">$ {(valueUsd ?? 0).toFixed(2)}</span>
}


