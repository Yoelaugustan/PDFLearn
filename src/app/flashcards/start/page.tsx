'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Menu from '@/components/Menu'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import * as Icons from '@heroicons/react/24/solid'
import type { Card } from '@/lib/types'

export default function FlashcardsPlayPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const raw = sessionStorage.getItem('pdf_flashcards') || '[]'
    try {
      setCards(JSON.parse(raw))
    } catch {
      setCards([])
    }
  }, [])

  if (!cards.length) {
    return <div className="bg-[#0D1117] min-h-screen flex items-center justify-center text-white">
      No flashcards found. Please generate them first.
    </div>
  }

  const card = cards[index]
  const isLast = index === cards.length - 1

  function handleFlip() {
    setFlipped(f => !f)
  }

  function handleNext() {
    if (isLast) {
      router.push('/flashcards/result')
    } else {
      setIndex(i => i + 1)
      setFlipped(false)
    }
  }

  return (
    <div className="bg-[#0D1117] min-h-screen flex flex-col">
      <Menu />
      <div className="flex-1 p-8 flex flex-col items-center justify-center space-y-8">
        <div
          className="w-full max-w-2xl h-64 relative"
          style={{ perspective: 1000 }}
        >
          <div
            className="w-full h-full rounded-xl shadow-lg transition-transform duration-500"
            style={{
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            <div
              className="absolute inset-0 bg-[#D1D5DB] text-[#0F172A] p-6 rounded-xl overflow-auto"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className='h-full'>
                <p className="whitespace-pre-wrap">{card.front}</p>
              </div>
            </div>
            <div
              className="absolute inset-0 bg-[#D1D5DB] text-[#0F172A] p-6 rounded-xl overflow-auto"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className='h-full'>
                <p className="whitespace-pre-wrap">{card.back}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Icons.ArrowsRightLeftIcon
            onClick={handleFlip}
            className="w-8 h-8 text-[#3B82F6] cursor-pointer"
          />
          <Button
            className="bg-[#3B82F6] px-6"
            onClick={handleNext}
          >
            {isLast ? 'Finish Deck' : 'Next Card'}
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
