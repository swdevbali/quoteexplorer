'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    // Only trigger search if the search value is different from URL
    const currentSearch = searchParams.get('search') || ''
    if (search === currentSearch) {
      return // Don't trigger if search hasn't actually changed
    }

    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      if (search) {
        params.set('search', search)
      } else {
        params.delete('search')
      }
      // Reset to page 1 when search changes
      params.delete('page')
      router.push(`/?${params.toString()}`)
      setIsTyping(false)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [search, router, searchParams])

  const handleClear = () => {
    setSearch('')
    const params = new URLSearchParams(searchParams)
    params.delete('search')
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <div className="flex items-center px-6 py-4">
          <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setIsTyping(true)
            }}
            placeholder="Search quotes, authors, or categories..."
            className="flex-1 bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400"
          />
          {search && (
            <button
              onClick={handleClear}
              className="ml-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {isTyping && (
            <div className="ml-3">
              <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}