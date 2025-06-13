// app/quiz/page.tsx
'use client'
import React, { useEffect, useState } from 'react'
import Menu from '@/components/Menu'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useSaveGenerated } from '@/hooks/useSaveGenerated'

type Q = { question: string; choices: string[]; answer: string }

export default function QuizPage() {
    const [qs, setQs] = useState<Q[]>([])
    const [fileName, setFileName] = useState<string>('Quiz')
    const { save, saving, error } = useSaveGenerated()

    useEffect(() => {
        const raw = sessionStorage.getItem('pdf_quiz') || '[]'
        try {
            const arr = JSON.parse(raw) as Q[]
            setQs(arr.slice(0, 30))
        } catch {
            setQs([])
        }

        const name = sessionStorage.getItem('pdfName')
        if (name) setFileName(name)
    }, [])

    const handleStartQuiz = () => {
        save('quiz', qs)
    }

    return (
        <div className="bg-[#0D1117] min-h-screen flex flex-col">
        <Menu />

        <div className="flex-1 p-8 text-[#D1D5DB]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">{fileName}</h2>
                <Button 
                    className="bg-[#2563EB]"
                    onClick={handleStartQuiz}
                    disabled={saving}
                >
                    Start Quiz
                </Button>
            </div>

            {qs.map((q, i) => (
                <div key={i} className="bg-[#D1D5DB] text-[#0F172A] rounded-xl p-6 mb-5">
                    <h3 className="font-semibold mb-2">
                        Q{i + 1}: {q.question}
                    </h3>
                    <ul className="list-disc list-inside mb-2">
                    {q.choices.map((c, j) => (
                        <li key={j}>{c}</li>
                    ))}
                    </ul>
                    <p className="text-green-600">Answer: {q.answer}</p>
                </div>
            ))}
        </div>

        <Footer />
        </div>
    )
}
