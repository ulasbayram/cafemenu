'use client'

import { useEffect, useState } from 'react'
import { STRINGS, type TransKey } from '@/i18n/strings'

function getLang(): 'en' | 'tr' {
  if (typeof window === 'undefined') return 'en'
  const v = window.localStorage.getItem('lang')
  return v === 'tr' ? 'tr' : 'en'
}

export function Trans({ k }: { k: TransKey }) {
  const [lang, setLang] = useState<'en' | 'tr'>(getLang())
  useEffect(() => {
    const onChange = (e: any) => setLang(e.detail?.lang === 'tr' ? 'tr' : 'en')
    window.addEventListener('lang-change', onChange as any)
    return () => window.removeEventListener('lang-change', onChange as any)
  }, [])

  return STRINGS[k][lang]
}

export default Trans


