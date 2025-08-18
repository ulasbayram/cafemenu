'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

type Currency = 'USD' | 'TRY'


function getStoredCurrency(): Currency {
  // SSR: always USD
  if (typeof window === 'undefined') return 'USD';
  const v = window.localStorage.getItem('currency');
  return v === 'TRY' ? 'TRY' : 'USD';
}


export function CurrencySelector() {
  const [currency, setCurrency] = useState<Currency>('USD'); // SSR default
  useEffect(() => {
    setCurrency(getStoredCurrency());
    const onChange = (e: any) => setCurrency(e.detail?.currency === 'TRY' ? 'TRY' : 'USD');
    window.addEventListener('currency-change', onChange as any);
    return () => window.removeEventListener('currency-change', onChange as any);
  }, []);

  const set = (next: Currency) => {
    setCurrency(next);
    try { window.localStorage.setItem('currency', next); } catch {}
    const ev = new CustomEvent('currency-change', { detail: { currency: next } });
    window.dispatchEvent(ev);
  };

  return (
    <div className="inline-flex items-center gap-1">
      <Button size="sm" variant={currency === 'USD' ? 'default' : 'outline'} onClick={() => set('USD')}>USD</Button>
      <Button size="sm" variant={currency === 'TRY' ? 'default' : 'outline'} onClick={() => set('TRY')}>TRY</Button>
    </div>
  );
}


export function Price({ valueUsd }: { valueUsd: number | null | undefined }) {
  // SSR default: USD, 40 TL per USD
  const [currency, setCurrency] = useState<Currency>('USD');
  const [rate, setRate] = useState<number>(40);

  useEffect(() => {
    setCurrency(getStoredCurrency());
    // Try to get rate from localStorage, fallback to 40
    const fromStorage = Number(window.localStorage.getItem('exchange_rate_try_per_usd') || '');
    if (Number.isFinite(fromStorage) && fromStorage > 0) setRate(fromStorage);
    const onChange = (e: any) => setCurrency(e.detail?.currency === 'TRY' ? 'TRY' : 'USD');
    const onRate = (e: any) => {
      const next = Number(e.detail?.rate);
      if (Number.isFinite(next) && next > 0) setRate(next);
    };
    window.addEventListener('currency-change', onChange as any);
    window.addEventListener('currency-rate-change', onRate as any);
    return () => {
      window.removeEventListener('currency-change', onChange as any);
      window.removeEventListener('currency-rate-change', onRate as any);
    };
  }, []);

  if (currency === 'TRY') {
    const v = (valueUsd ?? 0) * rate;
    return <span className="font-semibold whitespace-nowrap">₺ {v.toFixed(2)}</span>;
  }
  return <span className="font-semibold whitespace-nowrap">$ {(valueUsd ?? 0).toFixed(2)}</span>;
}


