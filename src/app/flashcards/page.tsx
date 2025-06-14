'use client'
import React, { useEffect, useState } from 'react'
import Menu from '@/components/Menu'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useSaveGenerated } from '@/hooks/useSaveGenerated'
import * as Icons from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import { Card } from '@/lib/types'

export default function FlashcardsPage() {
    const [cards, setCards] = useState<Card[]>([])
    const [draftCards, setDraftCards] = useState<Card[]>([])
    const [isEditing, setIsEditing] = useState(false)
    const [fileName, setFileName] = useState<string>('Flashcards')
    const { save, saving, error } = useSaveGenerated()
    const router = useRouter()

    useEffect(() => {
        const raw = sessionStorage.getItem('pdf_flashcards') || '[]'
        try {
            setCards(JSON.parse(raw).slice(0, 30))
        } catch {
            setCards([])
        }

        const name = sessionStorage.getItem('pdfName')
        if (name) setFileName(name)
    }, [])

    useEffect(() => {
        if (isEditing) {
            sessionStorage.setItem('pdf_flashcards', JSON.stringify(draftCards))
        }
    }, [draftCards, isEditing])

    const handleEdit = () => {
        setDraftCards(cards.map(c => ({ ...c })))
        setIsEditing(true)
    }

    const handleClose = async () => {
        setCards(draftCards)
        setIsEditing(false)
    }

    const handleStartFlashcards = () => {
        save('flashcards', cards)
        router.push('/flashcards/start')
    }

    const updateFront = (idx: number, front: string) => {
        const arr = [...draftCards]
        arr[idx].front = front
        setDraftCards(arr)
    }
    const updateBack = (idx: number, back: string) => {
        const arr = [...draftCards]
        arr[idx].back = back
        setDraftCards(arr)
    }

    return (
        <div className="bg-[#0D1117] min-h-screen flex flex-col">
            <Menu />

            <div className="flex-1 p-8 text-[#D1D5DB] space-y-6">
                <div className="relative flex flex-col md:flex-row items-center mb-10">
                    <h2 className="p-2 px-8 border border-[#D1D5DB] rounded-2xl mb-4 md:mb-0">Flashcards</h2>
                    <h2 className="text-2xl text-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                        {fileName}
                    </h2>
                    <div className="mt-4 md:mt-0 md:ml-auto flex space-x-2 items-center">
                        {!isEditing && (
                            <>
                                <Icons.PencilSquareIcon
                                    className="w-6 h-6 cursor-pointer text-[#D1D5DB]"
                                    onClick={handleEdit}
                                />
                                <Button
                                    className="bg-[#3B82F6] text-[#0D1117]"
                                    onClick={handleStartFlashcards}
                                    disabled={saving}
                                >
                                    {saving ? 'Saving…' : 'Start FlashCards'}
                                </Button>
                            </>
                        )}
                        {isEditing && (
                        <>
                            <Icons.XMarkIcon
                                className="w-6 h-6 cursor-pointer text-[#D1D5DB]"
                                onClick={handleClose}
                            />
                        </>
                        )}
                    </div>
                </div>

                {(isEditing ? draftCards : cards).map((c, i) => (
                <div
                    key={i}
                    className="bg-[#D1D5DB] text-[#0F172A] rounded-xl p-6 space-y-4"
                >
                    {isEditing ? (
                    <>
                        <div>
                            <label className="block font-semibold text-sm mb-1">
                                Front:
                            </label>
                            <input
                                type="text"
                                className="w-full bg-white p-2 rounded outline-0"
                                value={c.front}
                                onChange={e => updateFront(i, e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-sm mb-1 outline-0">
                                Back:
                            </label>
                            <textarea
                                className="w-full bg-white p-2 rounded h-24"
                                value={c.back}
                                onChange={e => updateBack(i, e.target.value)}
                            />
                        </div>
                    </>
                    ) : (
                    <>
                        <p className="font-semibold mb-2">{c.front}</p>
                        <details className="mt-2 text-sm text-gray-700">
                        <summary>Show Answer</summary>
                        <p className="mt-1">{c.back}</p>
                        </details>
                    </>
                    )}
                </div>
                ))}
            </div>

            <Footer />
        </div>
    )
}
