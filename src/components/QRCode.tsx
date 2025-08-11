'use client'

import { useEffect, useState } from 'react'
import QRCodeLib from 'qrcode'

type QRCodeProps = {
  value: string
  size?: number
  className?: string
}

export function QRCode({ value, size = 128, className }: QRCodeProps) {
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
      } catch (e) {
        if (!cancelled) setDataUrl(null)
      }
    }
    gen()
    return () => {
      cancelled = true
    }
  }, [value, size])

  if (!dataUrl) return (
    <div
      className={className}
      style={{ width: size, height: size }}
      aria-label="QR code placeholder"
    />
  )

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={dataUrl}
      alt="QR code"
      width={size}
      height={size}
      className={className}
    />
  )
}

export default QRCode


