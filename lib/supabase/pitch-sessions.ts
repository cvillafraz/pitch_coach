import { createClient } from './client'

export interface PitchSession {
  id: string
  user_id: string
  persona_name: string
  persona_type: string
  transcript?: string
  duration?: number
  overall_score?: number
  content_score?: number
  delivery_score?: number
  structure_score?: number
  engagement_score?: number
  feedback_summary?: string
  recommendations?: string[]
  audio_blob_url?: string
  audio_filename?: string
  audio_size_bytes?: number
  audio_uploaded_at?: string
  created_at: string
}

export interface CreatePitchSessionData {
  persona_name: string
  persona_type: string
  transcript?: string
  duration?: number
  audio_blob_url?: string
  audio_filename?: string
  audio_size_bytes?: number
}

export interface UpdatePitchSessionAudio {
  audio_blob_url: string
  audio_filename: string
  audio_size_bytes: number
}

export class PitchSessionService {
  private supabase = createClient()

  async createSession(data: CreatePitchSessionData): Promise<PitchSession | null> {
    try {
      // Get the current user
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('Authentication error:', authError)
        return null
      }

      const { data: session, error } = await this.supabase
        .from('pitch_sessions')
        .insert({
          ...data,
          user_id: user.id, // Explicitly set the user_id
          audio_uploaded_at: data.audio_blob_url ? new Date().toISOString() : null
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating pitch session:', error)
        return null
      }

      return session
    } catch (error) {
      console.error('Error creating pitch session:', error)
      return null
    }
  }

  async updateSessionAudio(sessionId: string, audioData: UpdatePitchSessionAudio): Promise<boolean> {
    try {
      // Get the current user to ensure RLS compliance
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('Authentication error:', authError)
        return false
      }

      const { error } = await this.supabase
        .from('pitch_sessions')
        .update({
          ...audioData,
          audio_uploaded_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .eq('user_id', user.id) // Ensure user owns the session

      if (error) {
        console.error('Error updating session audio:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error updating session audio:', error)
      return false
    }
  }

  async updateSessionScores(
    sessionId: string, 
    scores: {
      overall_score?: number
      content_score?: number
      delivery_score?: number
      structure_score?: number
      engagement_score?: number
      feedback_summary?: string
      recommendations?: string[]
    }
  ): Promise<boolean> {
    try {
      // Get the current user to ensure RLS compliance
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('Authentication error:', authError)
        return false
      }

      const { error } = await this.supabase
        .from('pitch_sessions')
        .update(scores)
        .eq('id', sessionId)
        .eq('user_id', user.id) // Ensure user owns the session

      if (error) {
        console.error('Error updating session scores:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error updating session scores:', error)
      return false
    }
  }

  async getUserSessions(limit = 10): Promise<PitchSession[]> {
    try {
      const { data: sessions, error } = await this.supabase
        .from('pitch_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching user sessions:', error)
        return []
      }

      return sessions || []
    } catch (error) {
      console.error('Error fetching user sessions:', error)
      return []
    }
  }

  async getSessionById(sessionId: string): Promise<PitchSession | null> {
    try {
      const { data: session, error } = await this.supabase
        .from('pitch_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()

      if (error) {
        console.error('Error fetching session:', error)
        return null
      }

      return session
    } catch (error) {
      console.error('Error fetching session:', error)
      return null
    }
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      // Get the current user to ensure RLS compliance
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('Authentication error:', authError)
        return false
      }

      const { error } = await this.supabase
        .from('pitch_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id) // Ensure user owns the session

      if (error) {
        console.error('Error deleting session:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting session:', error)
      return false
    }
  }

  async getSessionsWithAudio(): Promise<PitchSession[]> {
    try {
      const { data: sessions, error } = await this.supabase
        .from('pitch_sessions')
        .select('*')
        .not('audio_blob_url', 'is', null)
        .order('audio_uploaded_at', { ascending: false })

      if (error) {
        console.error('Error fetching sessions with audio:', error)
        return []
      }

      return sessions || []
    } catch (error) {
      console.error('Error fetching sessions with audio:', error)
      return []
    }
  }
}