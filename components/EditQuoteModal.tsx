'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Quote } from '@/types/quote'

interface EditQuoteModalProps {
  quote: Quote | null
  isOpen: boolean
  onClose: () => void
}

export default function EditQuoteModal({ quote, isOpen, onClose }: EditQuoteModalProps) {
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (isOpen && quote) {
      setContent(quote.content)
      setAuthor(quote.author)
      setCategory(quote.category || '')
      document.body.style.overflow = 'hidden'
      setError(null)
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, quote])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quote) return
    
    setIsSubmitting(true)
    setError(null)

    console.log('Updating quote:', {
      id: quote.id,
      content: content.trim(),
      author: author.trim(),
      category: category.trim() || null,
      updated_at: new Date().toISOString()
    })

    try {
      const { data, error } = await supabase
        .from('quotes')
        .update({
          content: content.trim(),
          author: author.trim(),
          category: category.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', quote.id)
        .select()

      console.log('Update result:', { data, error })

      if (error) {
        console.error('Update error details:', error)
        throw error
      }

      if (!data || data.length === 0) {
        console.error('No rows updated - this might be a permission issue')
        throw new Error('No rows were updated. You might not have permission to edit this quote.')
      }

      onClose()
      router.refresh()
    } catch (error: unknown) {
      console.error('Full update error:', error)
      setError(`Failed to update quote: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!quote || !confirm('Are you sure you want to delete this quote?')) return
    
    setIsSubmitting(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', quote.id)

      if (error) throw error

      onClose()
      router.refresh()
    } catch (error) {
      setError('Failed to delete quote. Please try again.')
      console.error('Error deleting quote:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen || !quote) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-pink-500 rounded-3xl blur opacity-25"></div>
        
        <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Edit Quote
          </h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quote Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white resize-none"
                placeholder="Enter the quote..."
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Author
              </label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
                placeholder="Quote author..."
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category (optional)
              </label>
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., motivation, wisdom, life..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-4 py-3 border border-red-300 text-red-700 font-medium rounded-xl hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white font-medium rounded-xl hover:from-violet-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}