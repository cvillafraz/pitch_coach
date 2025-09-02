import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#6200EA',
          background: 'linear-gradient(135deg, #6200EA 0%, #3700B3 100%)',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 60,
            }}
          >
            🎤
          </div>
        </div>
        <h1
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: 'white',
            margin: 0,
            textAlign: 'center',
          }}
        >
          Micdrop
        </h1>
        <p
          style={{
            fontSize: 36,
            color: 'rgba(255, 255, 255, 0.9)',
            margin: '20px 0 0 0',
            textAlign: 'center',
            maxWidth: '80%',
          }}
        >
          Pitch like a GOAT with AI
        </p>
        <p
          style={{
            fontSize: 24,
            color: 'rgba(255, 255, 255, 0.7)',
            margin: '10px 0 0 0',
            textAlign: 'center',
          }}
        >
          Practice with AI avatars • Close more deals
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}