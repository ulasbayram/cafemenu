'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trans } from '@/components/Trans'

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState('')
  const [rate, setRate] = useState<{ value: number | null; date: string | null; source: string }>(
    { value: null, date: null, source: 'Loading' }
  )

  useEffect(() => {
    try {
      const name = localStorage.getItem('dashboard_display_name') || ''
      setDisplayName(name)
    } catch {}

    fetch('/api/exchange-rate')
      .then((response) => response.json())
      .then((data) => {
        const nextRate = Number(data.rate)
        setRate({
          value: Number.isFinite(nextRate) ? nextRate : null,
          date: data.date ?? null,
          source: data.source ?? 'Unknown',
        })
      })
      .catch(() => setRate({ value: null, date: null, source: 'Unavailable' }))
  }, [])

  const save = () => {
    try {
      localStorage.setItem('dashboard_display_name', displayName.trim())
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
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <Label><Trans k="exchangeRate" /></Label>
            <div className="rounded-md border bg-muted/30 px-3 py-2">
              {rate.value ? (
                <span>1 USD = {rate.value.toFixed(2)} TRY</span>
              ) : (
                <span>Exchange rate is temporarily unavailable.</span>
              )}
            </div>
            <p>
              The public menu fetches the latest USD/TRY rate automatically when guests switch to USD.
              {rate.date ? ` Last rate date: ${rate.date}.` : ''}
              {rate.source ? ` Source: ${rate.source}.` : ''}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


