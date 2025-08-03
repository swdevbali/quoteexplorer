'use client'

import { Quote } from '@/types/quote'
import QuoteCard from './QuoteCard'

interface QuoteListProps {
  quotes: Quote[]
}

export default function QuoteList({ quotes }: QuoteListProps) {
  if (quotes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No quotes found.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {quotes.map((quote) => (
        <QuoteCard key={quote.id} quote={quote} />
      ))}
    </div>
  )
}