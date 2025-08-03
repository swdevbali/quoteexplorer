'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface CategoryFilterProps {
  categories: string[]
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || ''

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams)
    if (category === currentCategory) {
      params.delete('category')
    } else if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    // Reset to page 1 when category changes
    params.delete('page')
    router.push(`/?${params.toString()}`)
  }

  const getCategoryStyle = (category: string) => {
    const baseStyle = "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer"
    
    if (category === currentCategory) {
      const colors: { [key: string]: string } = {
        motivation: 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25',
        wisdom: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/25',
        life: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25',
        inspiration: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25',
        leadership: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-500/25',
        perseverance: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/25'
      }
      return `${baseStyle} ${colors[category.toLowerCase()] || 'bg-gray-700 text-white shadow-lg'}`
    }
    
    return `${baseStyle} bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600`
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
        Categories
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryChange('')}
          className={`${getCategoryStyle('')} ${!currentCategory ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg' : ''}`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={getCategoryStyle(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}