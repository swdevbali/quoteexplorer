'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'

export default function QuoteForm() {
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  
  const router = useRouter()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!user) {
      setError('Please login to add quotes.')
      setIsSubmitting(false)
      return
    }

    console.log('QuoteForm submitting quote:', {
      content: content.trim(),
      author: author.trim(),
      category: category.trim() || null,
      user_id: user.id
    })

    try {
      const { data, error } = await supabase
        .from('quotes')
        .insert([
          {
            content: content.trim(),
            author: author.trim(),
            category: category.trim() || null,
            user_id: user.id
          }
        ])
        .select()

      console.log('QuoteForm insert result:', { data, error })

      if (error) {
        console.error('QuoteForm Supabase error details:', error)
        throw error
      }

      setContent('')
      setAuthor('')
      setCategory('')
      router.refresh()
    } catch (error: unknown) {
      console.error('QuoteForm full error object:', error)
      console.error('QuoteForm error message:', error instanceof Error ? error.message : "Unknown error")
      console.error('QuoteForm error details:', (error as { details?: string })?.details)
      console.error('QuoteForm error hint:', (error as { hint?: string })?.hint)
      setError(`Failed to add quote: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Add Your Quote
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Please login to add your own quotes to the collection.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Add a New Quote
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="content" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
          Quote Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Enter the quote..."
        />
      </div>

      <div className="mb-4">
        <label htmlFor="author" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
          Author
        </label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Quote author..."
        />
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
          Category (optional)
        </label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="e.g., motivation, wisdom, life..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
      >
        {isSubmitting ? 'Adding...' : 'Add Quote'}
      </button>
    </form>
  )
}