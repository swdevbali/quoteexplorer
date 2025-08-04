'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import QuoteModal from './QuoteModal'
import AuthModalWithWelcome from './AuthModalWithWelcome'

export default function AddQuoteButton() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    
    checkUser()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })
    
    return () => subscription.unsubscribe()
  }, [])

  const handleButtonClick = () => {
    if (user) {
      setIsQuoteModalOpen(true)
    } else {
      setIsAuthModalOpen(true)
    }
  }

  return (
    <>
      <button
        onClick={handleButtonClick}
        className="group relative px-6 py-4 bg-gradient-to-r from-violet-500 to-pink-500 text-white font-medium rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Quote</span>
        </div>
      </button>

      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
      <AuthModalWithWelcome isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} showWelcome={true} />
    </>
  )
}