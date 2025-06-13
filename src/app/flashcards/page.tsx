// app/flashcards/page.tsx
'use client'
import React, { useEffect, useState } from 'react'
import Menu from '@/components/Menu'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useSaveGenerated } from '@/hooks/useSaveGenerated'

type Card = { front: string; back: string }

export default function FlashcardsPage() {
    const [cards, setCards] = useState<Card[]>([])
    const [fileName, setFileName] = useState<string>('Flashcards')
    const { save, saving, error } = useSaveGenerated()

    useEffect(() => {
        const raw = sessionStorage.getItem('pdf_flashcards') || '[]'
        try {
            const arr = JSON.parse(raw) as Card[]
            setCards(arr.slice(0, 30))
        } catch {
            setCards([])
        }

        const name = sessionStorage.getItem('pdfName')
        if (name) setFileName(name)
    }, [])

    const handleStartFlashcards = () => {
        save('flashcards', cards)
    }

    return (
        <div className="bg-[#0D1117] min-h-screen flex flex-col">
            <Menu />

            <div className="flex-1 p-8 text-[#D1D5DB] space-y-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl">{fileName}</h2>
                    <Button 
                        className="bg-[#2563EB]"
                        onClick={handleStartFlashcards}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Start Flashcards'}
                    </Button>
                </div>

                {cards.map((c, i) => (
                    <div key={i} className="bg-[#D1D5DB] text-[#0F172A] rounded-xl p-6">
                        <p className="font-semibold mb-2">{c.front}</p>
                        <details className="mt-2 text-sm text-gray-700">
                        <summary>Show Answer</summary>
                        <p className="mt-1">{c.back}</p>
                        </details>
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    )
}
