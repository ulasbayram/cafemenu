import { NextResponse } from "next/server";

const FRANKFURTER_RATE_URL = "https://api.frankfurter.dev/v2/rate/USD/TRY?providers=TCMB";
const FALLBACK_USD_TRY_RATE = 40;

export const revalidate = 3600;

export async function GET() {
  try {
    const response = await fetch(FRANKFURTER_RATE_URL, {
      next: { revalidate },
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Frankfurter returned ${response.status}`);
    }

    const data = await response.json();
    const rate = Number(data?.rate);

    if (!Number.isFinite(rate) || rate <= 0) {
      throw new Error("Frankfurter returned an invalid USD/TRY rate");
    }

    return NextResponse.json(
      {
        base: "USD",
        quote: "TRY",
        rate,
        date: data?.date ?? null,
        source: "Frankfurter / TCMB",
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown exchange-rate error";

    return NextResponse.json(
      {
        base: "USD",
        quote: "TRY",
        rate: FALLBACK_USD_TRY_RATE,
        date: null,
        source: "Fallback",
        warning: message,
      },
      { status: 200 }
    );
  }
}
