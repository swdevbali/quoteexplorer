'use client'

import { useState, useEffect } from 'react'
import { Quote } from '@/types/quote'
import QuoteDetailModal from './QuoteDetailModal'
import EditQuoteModal from './EditQuoteModal'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface QuoteCardProps {
  quote: Quote
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const canEdit = user && quote.user_id === user.id

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditModalOpen(true)
  }
  const getCategoryColor = (category: string | null) => {
    if (!category) return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
    
    const colors: { [key: string]: string } = {
      motivation: 'bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 text-orange-700 dark:text-orange-400',
      wisdom: 'bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 text-purple-700 dark:text-purple-400',
      life: 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 text-green-700 dark:text-green-400',
      inspiration: 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-700 dark:text-blue-400',
      leadership: 'bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 text-amber-700 dark:text-amber-400',
      perseverance: 'bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 text-rose-700 dark:text-rose-400'
    }
    
    return colors[category.toLowerCase()] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
  }

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50 dark:to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative p-6">
          <div className="absolute -top-4 -right-4 text-8xl text-gray-200 dark:text-gray-700 opacity-50 select-none">
            "
          </div>
          
          <blockquote className="relative z-10 mb-6">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed line-clamp-3">
              {quote.content}
            </p>
          </blockquote>
          
          <div className="flex justify-between items-end gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-0.5 bg-gradient-to-r from-gray-400 to-gray-300 dark:from-gray-600 dark:to-gray-700"></div>
              <cite className="text-gray-600 dark:text-gray-400 not-italic font-medium">
                {quote.author}
              </cite>
            </div>
            
            {quote.category && (
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getCategoryColor(quote.category)}`}>
                {quote.category}
              </span>
            )}
          </div>
          
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            {canEdit && (
              <button
                onClick={handleEditClick}
                className="p-1 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors"
                title="Edit quote"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </div>

      <QuoteDetailModal 
        quote={quote} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <EditQuoteModal 
        quote={quote} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </>
  )
}