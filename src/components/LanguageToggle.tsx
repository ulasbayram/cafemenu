'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

type Lang = 'en' | 'tr'

function getStoredLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  const v = window.localStorage.getItem('lang')
  return v === 'tr' ? 'tr' : 'en'
}

export function LanguageToggle() {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    setLang(getStoredLang())
  }, [])

  const set = (next: Lang) => {
    setLang(next)
    try { window.localStorage.setItem('lang', next) } catch {}
    const ev = new CustomEvent('lang-change', { detail: { lang: next } })
    window.dispatchEvent(ev)
  }

  return (
    <div className="inline-flex items-center gap-1">
      <Button size="icon" variant={lang === 'en' ? 'default' : 'outline'} aria-label="English" onClick={() => set('en')}>EN</Button>
      <Button size="icon" variant={lang === 'tr' ? 'default' : 'outline'} aria-label="Türkçe" onClick={() => set('tr')}>TR</Button>
    </div>
  )
}

export default LanguageToggle


