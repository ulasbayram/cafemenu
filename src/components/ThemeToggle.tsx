'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'

type Theme = 'light' | 'dark'

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
    root.style.colorScheme = 'dark'
  } else {
    root.classList.remove('dark')
    root.style.colorScheme = 'light'
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme') as Theme | null
      const initial: Theme = stored === 'dark' ? 'dark' : 'light'
      setTheme(initial)
      applyTheme(initial)
    } catch {
      // ignore
    }
  }, [])

  const toggle = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try {
      localStorage.setItem('theme', next)
    } catch {
      // ignore
    }
    applyTheme(next)
  }, [theme])

  return (
    <Button 
      variant="outline" 
      size="icon" 
      aria-label="Toggle theme" 
      onClick={toggle}
      className="h-9 w-9 sm:h-10 sm:w-10"
    >
      {theme === 'dark' ? 
        <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : 
        <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      }
    </Button>
  )
}

export default ThemeToggle


