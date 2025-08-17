'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trans } from '@/components/Trans'

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState('')
  const [rate, setRate] = useState('')

  useEffect(() => {
    try {
      const name = localStorage.getItem('dashboard_display_name') || ''
      const storedRate = localStorage.getItem('exchange_rate_try_per_usd') || ''
      setDisplayName(name)
      setRate(storedRate)
    } catch {}
  }, [])

  const save = () => {
    try {
      localStorage.setItem('dashboard_display_name', displayName.trim())
    } catch {}
  }

  const saveRate = () => {
    const n = Number(rate)
    if (!Number.isFinite(n) || n <= 0) return
    try {
      localStorage.setItem('exchange_rate_try_per_usd', String(n))
      const ev = new CustomEvent('currency-rate-change', { detail: { rate: n } })
      window.dispatchEvent(ev)
    } catch {}
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle><Trans k="dashboardSettings" /></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName"><Trans k="displayName" /></Label>
              <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g., My Cafe Admin" />
              <div>
                <Button size="sm" onClick={save}><Trans k="saveName" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle><Trans k="currency" /></CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="rate"><Trans k="exchangeRate" /></Label>
            <Input id="rate" type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g., 35" />
            <div>
              <Button size="sm" onClick={saveRate}><Trans k="saveRate" /></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


