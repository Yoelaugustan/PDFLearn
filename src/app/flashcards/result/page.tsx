'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Menu from '@/components/Menu'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import type { Card } from '@/lib/types'

export default function FlashcardsResultPage() {
  const [count, setCount] = useState<number|null>(null)
  const router = useRouter()

  useEffect(() => {
    const raw = sessionStorage.getItem('pdf_flashcards') || '[]'
    try {
      const arr = JSON.parse(raw) as Card[]
      setCount(arr.length)
    } catch {
      setCount(null)
    }
  }, [])

  if (count === null) {
    return (
      <div className="bg-[#0D1117] min-h-screen flex items-center justify-center text-white">
        No flashcards found. Generate some first!
      </div>
    )
  }

  return (
    <div className="bg-[#0D1117] min-h-screen flex flex-col">
      <Menu />

      <div className="flex-1 p-8 text-[#D1D5DB] flex flex-col items-center justify-center">
        <h2 className="text-3xl mb-4">Flashcards Complete!</h2>
        <p className="text-xl mb-6">
          You reviewed <span className="font-bold">{count}</span> cards
        </p>
        <div className="flex gap-5">
          <Button
            className="bg-[#3B82F6] px-8"
            onClick={() => router.push('/flashcards/start')}
          >
            Review Again
          </Button>
          <Button
            className="bg-[#3B82F6] px-8"
            onClick={() => router.push('/landing')}
          >
            Back to Home
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
