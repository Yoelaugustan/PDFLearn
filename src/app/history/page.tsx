'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import Menu from '@/components/Menu'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useFetchHistory } from '@/hooks/useFetchGenerated'
import { HistoryEntry } from '@/lib/types'

export default function HistoryPage() {
    const { history, loading } = useFetchHistory()
    const router = useRouter()

    if (loading) return <div className="p-8 text-white">Loading history…</div>

    const handleLearnAgain = (method: string, h: HistoryEntry) => {
        sessionStorage.setItem('pdf_docId', h.document_id)
        router.push(`/${method}`)
    }

    return (
        <div className="bg-[#0D1117] min-h-screen flex flex-col">
        <Menu />

        <main className="flex-1 p-8 text-[#D1D5DB]">
            {history.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    No past sessions found.
                </div>
            ) : (
                <>
                    <h2 className="text-2xl mb-6">Recent Material</h2>
                    <ol className="space-y-4">
                    {history.map((h, i) => (
                        <li key={h.id} className="flex items-center bg-[#D1D5DB] rounded-xl p-4">
                            <span className="w-6 text-right mr-4 text-[#0F172A]">{i + 1}.</span>
                            <div className="flex-1 flex items-center justify-between text-[#0F172A]">
                                <div className='flex gap-5'>
                                    <span className="font-semibold">{h.name}</span>
                                    <span>Type: <strong>{h.method}</strong></span>
                                </div>
                                <Button
                                    className="bg-[#3B82F6] px-4"
                                    onClick={() => handleLearnAgain(h.method, h)}
                                >
                                    Learn Again &rarr;
                                </Button>
                            </div>
                        </li>
                    ))}
                    </ol>
                </>
            )}
        </main>

        <Footer />
        </div>
    )
}
