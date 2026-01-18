// Health check API route
// Returns basic app status for monitoring
export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    name: 'BaseRush Arena'
  })
}