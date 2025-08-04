import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const quote = searchParams.get('quote') || 'Discover and share inspiring quotes'
    const author = searchParams.get('author') || 'Quote Explorer'
    
    // Truncate quote if too long
    const truncatedQuote = quote.length > 200 ? quote.slice(0, 200) + '...' : quote

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1f2937',
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '80px',
            position: 'relative',
          }}
        >
          {/* Background decoration */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            }}
          />
          
          {/* Quote content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '900px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Quote text */}
            <div
              style={{
                fontSize: '48px',
                fontWeight: '300',
                color: 'white',
                lineHeight: '1.4',
                marginBottom: '40px',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              }}
            >
              "{truncatedQuote}"
            </div>
            
            {/* Author */}
            <div
              style={{
                fontSize: '32px',
                fontWeight: '600',
                color: '#e5e7eb',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              — {author}
            </div>
          </div>
          
          {/* Brand */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '60px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '24px',
              fontWeight: '600',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
                fontWeight: '700',
              }}
            >
              Q
            </div>
            Quote Explorer
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`Failed to generate OG image: ${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}