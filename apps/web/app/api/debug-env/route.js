export async function GET() {
  // Only return non-sensitive variables or indicators
  return new Response(
    JSON.stringify({
      nextAuthUrlSet: !!process.env.NEXTAUTH_URL,
      nextAuthSecretSet: !!process.env.NEXTAUTH_SECRET,
      nodeEnv: process.env.NODE_ENV,
      apiUrlSet: !!process.env.NEXT_PUBLIC_API_URL,
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
      // Add other non-sensitive variables
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
