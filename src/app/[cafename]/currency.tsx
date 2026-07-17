'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

type Currency = 'USD' | 'TRY'

type ExchangeRateResponse = {
  rate: number;
  date: string | null;
  source: string;
};

let cachedUsdTryRate: ExchangeRateResponse | null = null;
let usdTryRatePromise: Promise<ExchangeRateResponse> | null = null;

async function loadUsdTryRate() {
  if (cachedUsdTryRate) return cachedUsdTryRate;
  if (!usdTryRatePromise) {
    usdTryRatePromise = fetch("/api/exchange-rate")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch exchange rate");
        return response.json();
      })
      .then((data: ExchangeRateResponse) => {
        const rate = Number(data.rate);
        if (!Number.isFinite(rate) || rate <= 0) {
          throw new Error("Invalid exchange rate");
        }
        cachedUsdTryRate = { ...data, rate };
        return cachedUsdTryRate;
      })
      .finally(() => {
        usdTryRatePromise = null;
      });
  }

  return usdTryRatePromise;
}

function getStoredCurrency(): Currency {
  // SSR: match the app's primary market currency.
  if (typeof window === 'undefined') return 'TRY';
  const v = window.localStorage.getItem('currency');
  return v === 'USD' ? 'USD' : 'TRY';
}


export function CurrencySelector() {
  const [currency, setCurrency] = useState<Currency>('TRY');
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

  const toggle = () => {
    const next = currency === 'USD' ? 'TRY' : 'USD';
    set(next);
  };

  return (
    <>
      {/* Mobile: Single toggle button */}
      <Button 
        size="icon" 
        variant="outline" 
        aria-label={`Current currency: ${currency}. Click to switch`}
        onClick={toggle}
        className="sm:hidden h-9 w-9 text-xs"
      >
        {currency}
      </Button>
      
      {/* Desktop: Two separate buttons */}
      <div className="hidden sm:inline-flex items-center gap-1">
        <Button size="sm" variant={currency === 'USD' ? 'default' : 'outline'} onClick={() => set('USD')}>USD</Button>
        <Button size="sm" variant={currency === 'TRY' ? 'default' : 'outline'} onClick={() => set('TRY')}>TRY</Button>
      </div>
    </>
  );
}


export function Price({ valueUsd }: { valueUsd: number | null | undefined }) {
  // Stored item prices are entered as TRY in the dashboard.
  const [currency, setCurrency] = useState<Currency>('TRY');
  const [rate, setRate] = useState<number>(40);

  useEffect(() => {
    setCurrency(getStoredCurrency());
    const onChange = (e: any) => setCurrency(e.detail?.currency === 'TRY' ? 'TRY' : 'USD');
    window.addEventListener('currency-change', onChange as any);
    return () => {
      window.removeEventListener('currency-change', onChange as any);
    };
  }, []);

  useEffect(() => {
    if (currency !== "USD") return;

    let cancelled = false;
    loadUsdTryRate()
      .then((data) => {
        if (!cancelled) setRate(data.rate);
      })
      .catch(() => {
        if (!cancelled) setRate(40);
      });

    return () => {
      cancelled = true;
    };
  }, [currency]);

  if (valueUsd == null) {
    return <span className="font-semibold whitespace-nowrap">-</span>;
  }

  if (currency === 'TRY') {
    return <span className="font-semibold whitespace-nowrap">{"\u20ba"} {valueUsd.toFixed(2)}</span>;
  }

  const usdValue = valueUsd / rate;
  return <span className="font-semibold whitespace-nowrap">$ {usdValue.toFixed(2)}</span>;
}


