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
          backgroundColor: '#1a1a1a',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
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
              width: 100,
              height: 100,
              borderRadius: '50%',
              backgroundColor: '#6200EA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 50,
            }}
          >
            💎
          </div>
        </div>
        <h1
          style={{
            fontSize: 64,
            fontWeight: 'bold',
            color: 'white',
            margin: 0,
            textAlign: 'center',
          }}
        >
          Unlock Premium Coaching
        </h1>
        <p
          style={{
            fontSize: 32,
            color: 'rgba(255, 255, 255, 0.8)',
            margin: '20px 0 40px 0',
            textAlign: 'center',
            maxWidth: '80%',
          }}
        >
          Pay with Base ETH for AI voice coaching
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 40,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(98, 0, 234, 0.2)',
              borderRadius: 16,
              padding: 30,
              border: '2px solid #6200EA',
            }}
          >
            <div style={{ fontSize: 24, color: 'white', fontWeight: 'bold' }}>
              Single Session
            </div>
            <div style={{ fontSize: 36, color: '#6200EA', fontWeight: 'bold', margin: '10px 0' }}>
              0.001 ETH
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 193, 7, 0.2)',
              borderRadius: 16,
              padding: 30,
              border: '2px solid #FFC107',
            }}
          >
            <div style={{ fontSize: 24, color: 'white', fontWeight: 'bold' }}>
              Monthly Plan
            </div>
            <div style={{ fontSize: 36, color: '#FFC107', fontWeight: 'bold', margin: '10px 0' }}>
              0.05 ETH
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}