'use client'

import { useEffect, useState } from 'react'
import QRCodeLib from 'qrcode'
import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

type QRCodeProps = {
  value: string
  size?: number
  className?: string
  downloadName?: string
  label?: string
  showActions?: boolean
}

function safeFileName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'qr-menu'
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function QRCode({ value, size = 128, className, downloadName = 'qr-menu', label = 'QR code', showActions = false }: QRCodeProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function gen() {
      try {
        const url = await QRCodeLib.toDataURL(value, {
          width: size,
          margin: 1,
          errorCorrectionLevel: 'M',
          color: { dark: '#000000', light: '#ffffff00' },
        })
        if (!cancelled) setDataUrl(url)
      } catch {
        if (!cancelled) setDataUrl(null)
      }
    }
    gen()
    return () => {
      cancelled = true
    }
  }, [value, size])

  const downloadPng = () => {
    if (!dataUrl) return
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `${safeFileName(downloadName)}.png`
    link.click()
  }

  const downloadSvg = async () => {
    const svg = await QRCodeLib.toString(value, {
      type: 'svg',
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#000000', light: '#ffffff' },
    })
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${safeFileName(downloadName)}.svg`
    link.click()
    URL.revokeObjectURL(url)
  }

  const printQr = () => {
    if (!dataUrl) return
    const printWindow = window.open('', '_blank', 'width=480,height=640')
    if (!printWindow) return
    const escapedLabel = escapeHtml(label)
    const escapedValue = escapeHtml(value)

    printWindow.document.write(`
      <html>
        <head>
          <title>${escapedLabel}</title>
          <style>
            body { font-family: Arial, sans-serif; display: grid; place-items: center; min-height: 100vh; margin: 0; }
            .sheet { text-align: center; border: 1px solid #ddd; padding: 32px; }
            img { width: 240px; height: 240px; }
            p { margin: 16px 0 0; font-size: 18px; font-weight: 700; }
            small { display: block; margin-top: 8px; color: #555; word-break: break-all; max-width: 320px; }
          </style>
        </head>
        <body>
          <div class="sheet">
            <img src="${dataUrl}" alt="${escapedLabel}" />
            <p>${escapedLabel}</p>
            <small>${escapedValue}</small>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  if (!dataUrl) return (
    <div
      className={className}
      style={{ width: size, height: size }}
      aria-label="QR code placeholder"
    />
  )

  return (
    <div className="space-y-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dataUrl}
        alt={label}
        width={size}
        height={size}
        className={className}
      />
      {showActions && (
        <div className="grid grid-cols-3 gap-1">
          <Button type="button" variant="outline" size="sm" onClick={downloadPng} title="Download PNG" className="h-7 px-1 text-[10px]">
            PNG
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={downloadSvg} title="Download SVG" className="h-7 px-1 text-[10px]">
            SVG
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={printQr} title="Print QR" className="h-7 px-1">
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default QRCode


