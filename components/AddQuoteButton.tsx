'use client'

import { useState } from 'react'
import QuoteModal from './QuoteModal'

export default function AddQuoteButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
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

      <QuoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}