-- Add audio storage fields to pitch_sessions table
ALTER TABLE public.pitch_sessions ADD COLUMN IF NOT EXISTS audio_blob_url TEXT;
ALTER TABLE public.pitch_sessions ADD COLUMN IF NOT EXISTS audio_filename TEXT;
ALTER TABLE public.pitch_sessions ADD COLUMN IF NOT EXISTS audio_size_bytes BIGINT;
ALTER TABLE public.pitch_sessions ADD COLUMN IF NOT EXISTS audio_uploaded_at TIMESTAMP WITH TIME ZONE;

-- Add indexes for audio-related queries
CREATE INDEX IF NOT EXISTS idx_pitch_sessions_audio_uploaded 
ON public.pitch_sessions(user_id, audio_uploaded_at) 
WHERE audio_blob_url IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.pitch_sessions.audio_blob_url IS 'Vercel Blob storage URL for the audio recording';
COMMENT ON COLUMN public.pitch_sessions.audio_filename IS 'Original filename of the uploaded audio';
COMMENT ON COLUMN public.pitch_sessions.audio_size_bytes IS 'Size of the audio file in bytes';
COMMENT ON COLUMN public.pitch_sessions.audio_uploaded_at IS 'Timestamp when audio was successfully uploaded to blob storage';