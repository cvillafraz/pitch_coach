import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')
    const sessionId = searchParams.get('sessionId')
    const personaName = searchParams.get('personaName') || 'AI Coach'
    const personaType = searchParams.get('personaType') || 'general'
    const duration = searchParams.get('duration') ? parseInt(searchParams.get('duration')!) : undefined

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      )
    }

    const file = await request.blob()
    
    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    const blob = await put(filename, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    // Use server-side Supabase client
    const supabase = await createClient()
    let dbSession = null

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (sessionId) {
      // Update existing session with audio
      const { data: updatedSession, error } = await supabase
        .from('pitch_sessions')
        .update({
          audio_blob_url: blob.url,
          audio_filename: filename,
          audio_size_bytes: file.size,
          audio_uploaded_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .select()
        .single()
      
      if (!error) {
        dbSession = updatedSession
      }
    } else {
      // Create new session
      const { data: newSession, error } = await supabase
        .from('pitch_sessions')
        .insert({
          user_id: user.id,
          persona_name: personaName,
          persona_type: personaType,
          duration,
          audio_blob_url: blob.url,
          audio_filename: filename,
          audio_size_bytes: file.size,
          audio_uploaded_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (!error) {
        dbSession = newSession
      }
    }

    return NextResponse.json({
      url: blob.url,
      filename: filename,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      session: dbSession,
    })
  } catch (error) {
    console.error('Error uploading audio:', error)
    return NextResponse.json(
      { error: 'Failed to upload audio' },
      { status: 500 }
    )
  }
}