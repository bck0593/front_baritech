import { API_CONFIG, USE_MOCK_DATA } from '../../../lib/api-config'

export async function GET() {
  return Response.json({
    timestamp: new Date().toISOString(),
    config: {
      BASE_URL: API_CONFIG.BASE_URL,
      USE_MOCK_DATA: USE_MOCK_DATA,
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA,
    }
  })
}
