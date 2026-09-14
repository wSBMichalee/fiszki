// TYMCZASOWY ENDPOINT DIAGNOSTYCZNY - usunąć po znalezieniu przyczyny błędu Inngest
export async function GET() {
  return Response.json({
    nodeEnv: process.env.NODE_ENV,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    // Inngest – tylko pierwsze 12 znaków, nigdy pełne klucze
    eventKeyPrefix: process.env.INNGEST_EVENT_KEY?.slice(0, 12) ?? 'BRAK ZMIENNEJ',
    eventKeyLength: process.env.INNGEST_EVENT_KEY?.length ?? 0,
    signingKeyPrefix: process.env.INNGEST_SIGNING_KEY?.slice(0, 12) ?? 'BRAK ZMIENNEJ',
    signingKeyLength: process.env.INNGEST_SIGNING_KEY?.length ?? 0,
  })
}
