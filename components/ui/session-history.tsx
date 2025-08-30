"use client"

import { useState, useEffect } from 'react'
import { usePitchSessions } from '@/hooks/use-pitch-sessions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Download, Trash2, Clock, Calendar, FileAudio } from 'lucide-react'
import { formatDistance } from 'date-fns'

export function SessionHistory() {
  const { 
    sessions, 
    loading, 
    error, 
    deleteSession,
    refreshSessions 
  } = usePitchSessions()

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  const handleDelete = async (sessionId: string) => {
    if (confirm('Are you sure you want to delete this session?')) {
      await deleteSession(sessionId)
    }
  }

  const handleDownload = (url: string, filename: string) => {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 font-medium">Error loading sessions</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <Button 
          onClick={() => refreshSessions()} 
          variant="outline" 
          size="sm" 
          className="mt-3"
        >
          Retry
        </Button>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 border border-gray-200 rounded-lg">
        <FileAudio className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-700 font-medium mb-2">No sessions yet</p>
        <p className="text-gray-500 text-sm">
          Start recording your pitch to see your practice sessions here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-800">Recent Sessions</h3>
        <Button 
          onClick={() => refreshSessions()} 
          variant="outline" 
          size="sm"
        >
          Refresh
        </Button>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <Card key={session.id} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-800">
                      {session.persona_name}
                    </h4>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                      {session.persona_type}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    {session.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDuration(session.duration)}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDistance(new Date(session.created_at), new Date(), { 
                        addSuffix: true 
                      })}
                    </div>
                    {session.audio_size_bytes && (
                      <span className="text-xs">
                        {formatFileSize(session.audio_size_bytes)}
                      </span>
                    )}
                  </div>

                  {/* Scores */}
                  {session.overall_score && (
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-sm">
                        <span className="text-gray-600">Overall: </span>
                        <span className={`font-medium ${
                          session.overall_score >= 80 ? 'text-green-600' :
                          session.overall_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {session.overall_score}%
                        </span>
                      </div>
                      {session.content_score && (
                        <div className="text-sm">
                          <span className="text-gray-600">Content: </span>
                          <span className="font-medium">{session.content_score}%</span>
                        </div>
                      )}
                      {session.delivery_score && (
                        <div className="text-sm">
                          <span className="text-gray-600">Delivery: </span>
                          <span className="font-medium">{session.delivery_score}%</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Audio Player */}
                  {session.audio_blob_url && (
                    <div className="mb-3">
                      <audio controls className="w-full h-8" style={{ maxWidth: '300px' }}>
                        <source src={session.audio_blob_url} type="audio/webm" />
                        <source src={session.audio_blob_url} type="audio/mp4" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}

                  {/* Feedback */}
                  {session.feedback_summary && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">{session.feedback_summary}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-4">
                  {session.audio_blob_url && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(session.audio_blob_url!, session.audio_filename || 'recording.webm')}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(session.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}