'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalQuotes: number
}

export default function Pagination({ currentPage, totalPages, totalQuotes }: PaginationProps) {
  const searchParams = useSearchParams()

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page > 1) {
      params.set('page', page.toString())
    } else {
      params.delete('page')
    }
    return `/?${params.toString()}`
  }

  if (totalPages <= 1) return null

  const startQuote = (currentPage - 1) * 4 + 1
  const endQuote = Math.min(currentPage * 4, totalQuotes)

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Showing <span className="font-medium">{startQuote}</span> to{' '}
        <span className="font-medium">{endQuote}</span> of{' '}
        <span className="font-medium">{totalQuotes}</span> quotes
      </div>

      <div className="flex items-center gap-2">
        {/* Previous Button */}
        {currentPage <= 1 ? (
          <span className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-100 border border-gray-300 rounded-l-lg cursor-not-allowed">
            Previous
          </span>
        ) : (
          <Link
            href={createPageUrl(currentPage - 1)}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 hover:text-gray-700"
          >
            Previous
          </Link>
        )}

        {/* Page Numbers */}
        <div className="flex">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }

            const isActive = pageNum === currentPage

            return isActive ? (
              <span
                key={pageNum}
                className="px-3 py-2 text-sm font-medium border text-blue-600 bg-blue-50 border-blue-300"
              >
                {pageNum}
              </span>
            ) : (
              <Link
                key={pageNum}
                href={createPageUrl(pageNum)}
                className="px-3 py-2 text-sm font-medium border text-gray-500 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-700"
              >
                {pageNum}
              </Link>
            )
          })}
        </div>

        {/* Next Button */}
        {currentPage >= totalPages ? (
          <span className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-100 border border-gray-300 rounded-r-lg cursor-not-allowed">
            Next
          </span>
        ) : (
          <Link
            href={createPageUrl(currentPage + 1)}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 hover:text-gray-700"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  )
}