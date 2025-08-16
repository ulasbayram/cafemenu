'use client'

import { useEffect, useState } from 'react'

export type Bilingual = { en?: string | null; tr?: string | null } | string | null | undefined

function getLang(): 'en' | 'tr' {
  if (typeof window === 'undefined') return 'en'
  const v = window.localStorage.getItem('lang')
  return v === 'tr' ? 'tr' : 'en'
}

export function LangText({ value }: { value: Bilingual }) {
  const [lang, setLang] = useState<'en' | 'tr'>(getLang())
  useEffect(() => {
    const onChange = (e: any) => setLang(e.detail?.lang === 'tr' ? 'tr' : 'en')
    window.addEventListener('lang-change', onChange as any)
    return () => window.removeEventListener('lang-change', onChange as any)
  }, [])

  if (value == null) return null
  if (typeof value === 'string') {
    try {
      const obj = JSON.parse(value)
      if (obj && (typeof obj.en === 'string' || typeof obj.tr === 'string')) {
        const textParsed = lang === 'tr' ? (obj.tr ?? obj.en ?? '') : (obj.en ?? obj.tr ?? '')
        return <>{textParsed}</>
      }
    } catch {}
    return <>{value}</>
  }
  const text = lang === 'tr' ? (value.tr ?? value.en ?? '') : (value.en ?? value.tr ?? '')
  return <>{text}</>
}

export default LangText


