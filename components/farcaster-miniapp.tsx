'use client'

import { useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

export function FarcasterMiniApp() {
  useEffect(() => {
    const initializeMiniApp = async () => {
      try {
        await sdk.actions.ready()
      } catch (error) {
        console.error('Failed to initialize Farcaster miniapp:', error)
      }
    }

    initializeMiniApp()
  }, [])

  return null
}