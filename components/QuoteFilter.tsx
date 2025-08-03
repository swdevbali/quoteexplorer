'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export default function QuoteFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentFilter = searchParams.get('filter') || ''
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

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams)
    if (filter && filter !== currentFilter) {
      params.set('filter', filter)
    } else {
      params.delete('filter')
    }
    // Clear category when switching to my quotes
    if (filter === 'my-quotes') {
      params.delete('category')
    }
    // Reset to page 1 when filter changes
    params.delete('page')
    router.push(`/?${params.toString()}`)
  }

  if (!user) return null

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
        Filter
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleFilterChange('')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
            !currentFilter 
              ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          All Quotes
        </button>
        <button
          onClick={() => handleFilterChange('my-quotes')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
            currentFilter === 'my-quotes' 
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          My Quotes
        </button>
      </div>
    </div>
  )
}