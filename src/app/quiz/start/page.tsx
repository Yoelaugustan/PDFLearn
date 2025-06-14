'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Menu from '@/components/Menu'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Q } from '@/lib/types'

export default function QuizStartPage() {
    const [qs, setQs] = useState<Q[]>([])
    const [current, setCurrent] = useState(0)
    const [selected, setSelected] = useState<string|null>(null)
    const [score, setScore] = useState(0)
    const router = useRouter()

    useEffect(() => {
        const raw = sessionStorage.getItem('pdf_quiz') || '[]'
        try {
            setQs(JSON.parse(raw))
        } catch {
            setQs([])
        }
    }, [])

    const handleNext = () => {
        if (selected === qs[current].answer) {
            setScore(s => s + 1)
        }
        const next = current + 1
        if (next < qs.length) {
            setCurrent(next)
            setSelected(null)
        } else {
            sessionStorage.setItem(
                'quiz_result',
                JSON.stringify({ score: score + (selected===qs[current].answer ? 1 : 0), total: qs.length })
            )
            router.push('/quiz/result')
        }
    }

    if (!qs.length) {
        return (
        <div className="bg-[#0D1117] min-h-screen flex items-center justify-center text-white">
            No quiz available. Go back and generate one first.
        </div>
        )
    }

    const q = qs[current]

    return (
        <div className="bg-[#0D1117] min-h-screen flex flex-col">
            <Menu />
            <div className="flex-1 p-8 text-[#D1D5DB] flex flex-col items-center">
                <div className="bg-[#D1D5DB] text-[#0F172A] rounded-xl p-6 max-w-2xl w-full mb-8">
                    <h3 className="font-semibold mb-4">
                        Question {current + 1} / {qs.length}
                    </h3>
                    <p className="whitespace-pre-wrap">{q.question}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 w-full max-w-[90%]">
                    {q.choices.map((c, i) => (
                        <button
                            key={i}
                            onClick={() => setSelected(c)}
                            className={`
                                flex items-center p-4 bg-[#D1D5DB] rounded-xl
                                ${selected === c ? 'ring-2 ring-[#3B82F6]' : ''}
                            `}
                        >
                            <span
                                className={`
                                    flex-shrink-0 h-5 w-5 mr-3 rounded-full border-2 
                                    ${selected === c ? 'bg-[#3B82F6] border-[#3B82F6]' : 'border-gray-500'}
                                `}
                            />
                            <span className="text-[#0F172A]">{c}</span>
                        </button>
                    ))}
                </div>

                <Button
                    className="bg-[#3B82F6] px-8"
                    onClick={handleNext}
                    disabled={selected === null}
                >
                    Next Question
                </Button>
            </div>

            <Footer />
        </div>
    )
}
