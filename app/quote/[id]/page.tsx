import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Quote } from '@/types/quote'
import Link from 'next/link'

interface QuotePageProps {
  params: Promise<{ id: string }>
}

async function getQuote(id: string): Promise<Quote | null> {
  const supabase = createClient()
  
  const { data: quote, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !quote) {
    return null
  }

  return quote as Quote
}

export async function generateMetadata(props: QuotePageProps): Promise<Metadata> {
  const { id } = await props.params
  const quote = await getQuote(id)

  if (!quote) {
    return {
      title: 'Quote Not Found | Quote Explorer',
      description: 'The requested quote could not be found.',
    }
  }

  const title = `"${quote.content.slice(0, 100)}${quote.content.length > 100 ? '...' : ''}" - ${quote.author}`
  const description = `${quote.content} - ${quote.author}${quote.category ? ` | ${quote.category} quotes` : ''}`

  return {
    title: `${title} | Quote Explorer`,
    description,
    keywords: [
      'quote',
      'inspiration',
      quote.author,
      ...(quote.category ? [quote.category] : []),
      'wisdom',
      'motivation'
    ],
    openGraph: {
      title,
      description,
      url: `/quote/${id}`,
      type: 'article',
      images: [
        {
          url: `/api/og?quote=${encodeURIComponent(quote.content)}&author=${encodeURIComponent(quote.author)}`,
          width: 1200,
          height: 630,
          alt: `Quote by ${quote.author}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og?quote=${encodeURIComponent(quote.content)}&author=${encodeURIComponent(quote.author)}`],
    },
    alternates: {
      canonical: `/quote/${id}`,
    },
  }
}

export default async function QuotePage(props: QuotePageProps) {
  const { id } = await props.params
  const quote = await getQuote(id)

  if (!quote) {
    notFound()
  }

  // Generate structured data for rich snippets
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Quotation",
    "text": quote.content,
    "author": {
      "@type": "Person",
      "name": quote.author
    },
    "dateCreated": quote.created_at,
    "url": `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/quote/${id}`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/quote/${id}`
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation */}
          <nav className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Quote Explorer
            </Link>
          </nav>

          {/* Quote Display */}
          <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-25"></div>
            
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12">
              {/* Quote Content */}
              <div className="text-center">
                <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 dark:text-white leading-relaxed mb-8">
                  &ldquo;{quote.content}&rdquo;
                </blockquote>
                
                <cite className="text-xl md:text-2xl font-medium text-violet-600 dark:text-violet-400 not-italic">
                  — {quote.author}
                </cite>
                
                {quote.category && (
                  <div className="mt-6">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400">
                      {quote.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Share this quote
                  </h3>
                  
                  <div className="flex justify-center items-center gap-4">
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: `Quote by ${quote.author}`,
                            text: `"${quote.content}" - ${quote.author}`,
                            url: window.location.href,
                          })
                        } else {
                          navigator.clipboard.writeText(window.location.href)
                          alert('Link copied to clipboard!')
                        }
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-xl hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      Share
                    </button>
                    
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`"${quote.content}" - ${quote.author}`)
                        alert('Quote copied to clipboard!')
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Quote
                    </button>
                  </div>
                </div>
              </div>

              {/* Meta Information */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>
                  Shared on {new Date(quote.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </article>

          {/* Related Quotes Section */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              More quotes to explore
            </h2>
            
            <div className="text-center">
              <Link
                href={quote.category ? `/?category=${encodeURIComponent(quote.category)}` : '/'}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white font-medium rounded-xl hover:from-violet-600 hover:to-pink-600 transition-all duration-300"
              >
                {quote.category ? `Explore ${quote.category} Quotes` : 'Explore All Quotes'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}