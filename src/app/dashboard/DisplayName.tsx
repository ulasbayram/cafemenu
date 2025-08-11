'use client'

import { useEffect, useState } from 'react'

export function DashboardDisplayName({ emailFallback }: { emailFallback: string }) {
  const [name, setName] = useState<string>(emailFallback)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('dashboard_display_name')
      setName(stored && stored.trim().length > 0 ? stored : emailFallback)
    } catch {
      setName(emailFallback)
    }
  }, [emailFallback])

  return <span className="text-sm text-muted-foreground">{name}</span>
}

export default DashboardDisplayName


