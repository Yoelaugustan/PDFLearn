'use client'
import React, { useEffect, useMemo, useState } from 'react'
import Menu from '@/components/Menu'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import * as Icons from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import { Card } from '@/lib/types'
import { useGenerated } from '@/hooks/useFetchGenerated'

export default function FlashcardsPage() {
    const { data, fileName, loading, update } = useGenerated<{ cards: Card[] }>('flashcards')
    const [cards, setCards] = useState<Card[]>([])
    const [draftCards, setDraftCards] = useState<Card[]>([])
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (Array.isArray(data?.cards)) {
            const slice = (data.cards as Card[]).slice(0, 30)

            setCards(slice)

            setDraftCards(
                slice.map((c: Card) => ({
                    ...c,
                }))
            )
        }
    }, [data])

    const isUnchanged = useMemo(() => {
        return JSON.stringify(cards) === JSON.stringify(draftCards)
    }, [cards, draftCards])

    const handleUpdate = async () => {
        if (isEditing) return
        const ok = await update(draftCards)
        if (ok) {
            setCards(draftCards)
            setIsEditing(false)
        }
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

    if (loading) return <div className="p-8 text-white">Loading…</div>

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
                                    onClick={() => setIsEditing(true)}
                                />
                                <Button
                                    className="bg-[#3B82F6] text-[#0D1117]"
                                    onClick={handleUpdate}
                                    disabled={isEditing}
                                >
                                    { isEditing ? isUnchanged ? 'No changes' : 'Update' : 'Start Flashcards' }
                                </Button>
                            </>
                        )}
                        {isEditing && (
                        <>
                            <Icons.XMarkIcon
                                className="w-6 h-6 cursor-pointer text-[#D1D5DB]"
                                onClick={() => {setIsEditing(false); setCards(draftCards)}}
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
