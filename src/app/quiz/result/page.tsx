'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Menu from '@/components/Menu'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'

export default function QuizResultPage() {
    const [score, setScore] = useState<number|null>(null)
    const [total, setTotal] = useState<number|null>(null)
    const router = useRouter()

    useEffect(() => {
        const raw = sessionStorage.getItem('quiz_result')
        if (raw) {
            try {
                const { score, total } = JSON.parse(raw)
                setScore(score)
                setTotal(total)
            } catch {
                setScore(null)
                setTotal(null)
            }
        }
    }, [])

    if (score === null || total === null) {
        return (
            <div className="bg-[#0D1117] min-h-screen flex items-center justify-center text-white">
                No results found. Try taking the quiz first.
            </div>
        )
    }

    return (
        <div className="bg-[#0D1117] min-h-screen flex flex-col">
            <Menu />
            <div className="flex-1 p-8 text-[#D1D5DB] flex flex-col items-center justify-center">
                <h2 className="text-3xl mb-4">Quiz Complete!</h2>
                <p className="text-xl mb-6">
                    You scored <span className="font-bold">{score}</span> / {total}
                </p>
                <div className='flex gap-5'>
                    <Button
                        className="bg-[#3B82F6] px-8"
                        onClick={() => router.push('/quiz/start')}
                    >
                        Retake Quiz
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
