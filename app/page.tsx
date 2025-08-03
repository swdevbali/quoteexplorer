import { createClient } from '@/lib/supabase'
import { Quote } from '@/types/quote'
import QuoteList from '@/components/QuoteList'
import AddQuoteButton from '@/components/AddQuoteButton'
import SearchBar from '@/components/SearchBar'
import CategoryFilter from '@/components/CategoryFilter'
import QuoteFilter from '@/components/QuoteFilter'
import UserMenu from '@/components/UserMenu'
import Pagination from '@/components/Pagination'

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home(props: HomeProps) {
  const resolvedSearchParams = await props.searchParams
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : ''
  const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : ''
  const filter = typeof resolvedSearchParams.filter === 'string' ? resolvedSearchParams.filter : ''
  const pageParam = resolvedSearchParams.page
  const page = typeof pageParam === 'string' ? parseInt(pageParam) : 1
  
  
  const supabase = createClient()
  
  // Get current user for filtering
  const { data: { user } } = await supabase.auth.getUser()
  
  console.log('DEBUG: Current user:', user ? `logged in as ${user.email}` : 'not logged in')
  
  // Get unique categories
  const { data: categoriesData } = await supabase
    .from('quotes')
    .select('category')
    .not('category', 'is', null)
    
  const uniqueCategories = [...new Set(categoriesData?.map(q => q.category) || [])]
  
  // Build base query for counting total quotes - bypass RLS for testing
  let countQuery = supabase.from('quotes').select('id', { count: 'exact', head: true })
  
  if (search) {
    countQuery = countQuery.or(`content.ilike.%${search}%,author.ilike.%${search}%,category.ilike.%${search}%`)
  }
  
  if (category) {
    countQuery = countQuery.eq('category', category)
  }

  if (filter === 'my-quotes' && user) {
    countQuery = countQuery.eq('user_id', user.id)
  }
  
  // Get total count
  const { count: totalQuotes } = await countQuery
  
  // Calculate pagination
  const quotesPerPage = 4
  const totalPages = Math.ceil((totalQuotes || 0) / quotesPerPage)
  const offset = (page - 1) * quotesPerPage
  
  // Build query for paginated quotes
  let quotesQuery = supabase.from('quotes').select('*')
  
  if (search) {
    quotesQuery = quotesQuery.or(`content.ilike.%${search}%,author.ilike.%${search}%,category.ilike.%${search}%`)
  }
  
  if (category) {
    quotesQuery = quotesQuery.eq('category', category)
  }

  if (filter === 'my-quotes' && user) {
    quotesQuery = quotesQuery.eq('user_id', user.id)
  }
  
  const { data: quotes, error } = await quotesQuery
    .order('created_at', { ascending: false })
    .range(offset, offset + quotesPerPage - 1)

  if (error) {
    console.error('Error fetching quotes:', error)
  }
  
  console.log('DEBUG: Quotes query result:', { 
    quotesFound: quotes?.length || 0, 
    error: error?.message,
    user_id: user?.id 
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Quote Explorer
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover and share inspiring quotes
            </p>
          </div>
          <UserMenu />
        </header>

        <main>
          <div className="mb-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-start gap-4">
              <div className="flex-1">
                <SearchBar />
              </div>
              <AddQuoteButton />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <QuoteFilter />
              <CategoryFilter categories={uniqueCategories} />
            </div>
          </div>
          
          {(search || category || filter) && (
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Showing results for:</span>
              {search && (
                <span className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-full">
                  "{search}"
                </span>
              )}
              {category && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                  {category}
                </span>
              )}
              {filter === 'my-quotes' && (
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                  My Quotes
                </span>
              )}
              <span className="text-gray-500">({totalQuotes || 0} total quotes)</span>
            </div>
          )}
          
          {/* Top Pagination */}
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            totalQuotes={totalQuotes || 0} 
          />
          
          <div className="mt-8">
            <QuoteList quotes={quotes || []} />
          </div>
          
          {/* Bottom Pagination */}
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            totalQuotes={totalQuotes || 0} 
          />
        </main>
        
        {/* Footer */}
        <footer className="mt-16 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600 dark:text-gray-400">
              <p className="mb-2">
                © 2015-2025 <a 
                  href="https://remoteworker.id" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                >
                  Remote Worker Indonesia
                </a>
              </p>
              <p className="text-sm">
                Discover and share inspiring quotes
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
