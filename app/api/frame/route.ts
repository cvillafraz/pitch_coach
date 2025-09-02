import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'
import { CONTRACT_CONFIG, CURRENT_NETWORK } from '@/lib/web3-config'

interface FrameRequest {
  untrustedData: {
    fid: number
    url: string
    messageHash: string
    timestamp: number
    network: number
    buttonIndex: number
    castId?: {
      fid: number
      hash: string
    }
  }
  trustedData: {
    messageBytes: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: FrameRequest = await request.json()
    const { untrustedData } = body

    // Get user's wallet address (simplified - in production, verify Farcaster signature)
    // For now, we'll use a mock address based on FID
    const userAddress = `0x${untrustedData.fid.toString(16).padStart(40, '0')}`

    // Check user's premium access via smart contract
    const provider = new ethers.JsonRpcProvider(CURRENT_NETWORK.rpc)
    const contract = new ethers.Contract(
      CONTRACT_CONFIG.CONTRACT_ADDRESS,
      CONTRACT_CONFIG.ABI,
      provider
    )

    let hasPremiumAccess = false
    try {
      hasPremiumAccess = await contract.hasPremiumAccess(userAddress)
    } catch (error) {
      console.error('Error checking premium access:', error)
    }

    // Handle button interactions
    const buttonIndex = untrustedData.buttonIndex

    if (buttonIndex === 1) {
      // Start Pitch button
      if (hasPremiumAccess) {
        // Redirect to premium experience
        return new NextResponse(
          `<!DOCTYPE html>
          <html>
            <head>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/image/premium" />
              <meta property="fc:frame:button:1" content="🎤 Premium Coaching" />
              <meta property="fc:frame:button:2" content="📊 View Sessions" />
              <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/premium" />
            </head>
          </html>`,
          {
            headers: {
              'Content-Type': 'text/html',
            },
          }
        )
      } else {
        // Show payment options
        return new NextResponse(
          `<!DOCTYPE html>
          <html>
            <head>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/image/payment" />
              <meta property="fc:frame:button:1" content="💎 Buy Session (0.001 ETH)" />
              <meta property="fc:frame:button:2" content="📅 Monthly (0.05 ETH)" />
              <meta property="fc:frame:button:3" content="🚀 Open Web App" />
              <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/payment" />
            </head>
          </html>`,
          {
            headers: {
              'Content-Type': 'text/html',
            },
          }
        )
      }
    }

    // Default frame
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/image/welcome" />
          <meta property="fc:frame:button:1" content="🎯 Start Pitching" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame" />
        </head>
      </html>`,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    )
  } catch (error) {
    console.error('Frame API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  // Initial frame display
  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/image/welcome" />
        <meta property="fc:frame:button:1" content="🎯 Start Pitching" />
        <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame" />
        <meta property="og:title" content="Micdrop - AI Pitch Coach" />
        <meta property="og:description" content="Practice your investor pitch with AI avatars" />
      </head>
      <body>
        <h1>Micdrop - AI Pitch Coach</h1>
        <p>Practice your investor pitch with AI avatars</p>
      </body>
    </html>`,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  )
}