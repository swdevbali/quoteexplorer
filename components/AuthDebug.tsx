'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export default function AuthDebug() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<{ access_token?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get current session and user
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('Auth Debug - Session:', session)
      console.log('Auth Debug - Session Error:', error)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth Debug - Auth State Change:', event, session)
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  if (loading) {
    return <div className="p-4 bg-yellow-100 rounded text-sm">Loading auth state...</div>
  }

  return (
    <div className="p-4 bg-blue-100 rounded text-sm space-y-2">
      <h4 className="font-bold">Auth Debug Info:</h4>
      <p><strong>User:</strong> {user ? `${user.email} (${user.id})` : 'Not logged in'}</p>
      <p><strong>Session:</strong> {session ? 'Active' : 'None'}</p>
      <p><strong>Access Token:</strong> {session?.access_token ? 'Present' : 'Missing'}</p>
      {user && (
        <div>
          <p><strong>User Metadata:</strong></p>
          <pre className="text-xs bg-white p-2 rounded overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}