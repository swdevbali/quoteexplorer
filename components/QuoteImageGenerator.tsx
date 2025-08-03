'use client'

import { useRef } from 'react'
import { Quote } from '@/types/quote'
import html2canvas from 'html2canvas'

interface QuoteImageGeneratorProps {
  quote: Quote
  onImageGenerated: (imageUrl: string) => void
}

export default function QuoteImageGenerator({ quote, onImageGenerated }: QuoteImageGeneratorProps) {
  const canvasRef = useRef<HTMLDivElement>(null)

  const getCategoryColors = (category: string | null) => {
    if (!category) return {
      bgColor: '#374151',
      textColor: '#6B7280'
    }
    
    const colors: { [key: string]: { bgColor: string; textColor: string } } = {
      motivation: { bgColor: '#FFF7ED', textColor: '#EA580C' },
      wisdom: { bgColor: '#F3E8FF', textColor: '#7C3AED' },
      life: { bgColor: '#ECFDF5', textColor: '#059669' },
      inspiration: { bgColor: '#EFF6FF', textColor: '#2563EB' },
      leadership: { bgColor: '#FFFBEB', textColor: '#D97706' },
      perseverance: { bgColor: '#FDF2F8', textColor: '#E11D48' }
    }
    
    return colors[category.toLowerCase()] || { bgColor: '#F3F4F6', textColor: '#6B7280' }
  }

  const generateImage = async () => {
    if (!canvasRef.current) return

    try {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        width: 800,
        height: 600,
        useCORS: true,
        allowTaint: false,
        logging: false,
        ignoreElements: (element) => {
          return element.classList.contains('ignore-canvas')
        }
      })

      const imageUrl = canvas.toDataURL('image/png', 1.0)
      onImageGenerated(imageUrl)
    } catch (error) {
      console.error('Error generating image:', error)
      // Fallback: try without some options
      try {
        const canvas = await html2canvas(canvasRef.current, {
          scale: 1,
          width: 800,
          height: 600,
          logging: false
        })
        
        const imageUrl = canvas.toDataURL('image/png', 1.0)
        onImageGenerated(imageUrl)
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError)
      }
    }
  }

  // Auto-generate when component mounts
  setTimeout(generateImage, 100)

  const categoryColors = getCategoryColors(quote.category)

  return (
    <div style={{ position: 'fixed', top: '-2000px', left: '0', pointerEvents: 'none' }}>
      <div
        ref={canvasRef}
        style={{
          width: '800px',
          height: '600px',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        {/* Quote Icon */}
        <div style={{ marginBottom: '48px' }}>
          <svg 
            width="64" 
            height="64" 
            fill="#D1D5DB" 
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        {/* Quote Content */}
        <div style={{ textAlign: 'center', marginBottom: '64px', maxWidth: '600px' }}>
          <blockquote style={{ marginBottom: '48px' }}>
            <p style={{ 
              fontSize: '36px',
              fontWeight: '300',
              lineHeight: '1.6',
              color: '#1F2937',
              marginBottom: '48px',
              margin: '0'
            }}>
              {quote.content}
            </p>
          </blockquote>
          
          <cite style={{ 
            fontSize: '24px',
            fontWeight: '500',
            fontStyle: 'normal',
            color: '#4B5563'
          }}>
            — {quote.author}
          </cite>
        </div>

        {/* Category Badge */}
        {quote.category && (
          <div style={{ marginBottom: '64px' }}>
            <span style={{
              display: 'inline-block',
              fontSize: '14px',
              fontWeight: '600',
              padding: '8px 16px',
              borderRadius: '9999px',
              backgroundColor: categoryColors.bgColor,
              color: categoryColors.textColor
            }}>
              {quote.category}
            </span>
          </div>
        )}

        {/* Brand */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          right: '40px',
          fontSize: '16px',
          fontWeight: '500',
          color: '#6B7280'
        }}>
          Quote Explorer
        </div>
      </div>
    </div>
  )
}