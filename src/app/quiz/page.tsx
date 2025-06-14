'use client'
import React, { useEffect, useState } from 'react'
import Menu from '@/components/Menu'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useSaveGenerated } from '@/hooks/useSaveGenerated'
import * as Icons from '@heroicons/react/24/solid'
import { Q } from '@/lib/types'
import { useRouter } from 'next/navigation'

export default function QuizPage() {
    const [qs, setQs] = useState<Q[]>([])
    const [draftQs, setDraftQs] = useState<Q[]>([])
    const [isEditing, setIsEditing] = useState(false)
    const [fileName, setFileName] = useState<string>('Quiz')
    const { save, saving, error } = useSaveGenerated()
    const router = useRouter()

    useEffect(() => {
        const raw = sessionStorage.getItem('pdf_quiz') || '[]'
        try {
            setQs(JSON.parse(raw).slice(0,30))
        } catch {
            setQs([])
        }
        const name = sessionStorage.getItem('pdfName')
        if (name) setFileName(name)
    }, [])

    useEffect(() => {
        if (isEditing) {
            sessionStorage.setItem('pdf_quiz', JSON.stringify(draftQs))
        }
    }, [draftQs, isEditing])

    const handleEdit = () => {
        setDraftQs(qs.map(q => ({ ...q, choices: [...q.choices] })))
        setIsEditing(true)
    }
    const handleClose = () => {
        setQs(draftQs)
        setIsEditing(false)
    }

    const handleStartQuiz = () => {
        save('quiz', qs)
        router.push("/quiz/start")
    }

    const updateQuestion = (idx: number, question: string) => {
        setDraftQs(ds => {
            const out = [...ds]
            out[idx] = { ...out[idx], question: question }
            return out
        })
    }
    const updateChoice = (qIdx: number, cIdx: number, choice: string) => {
        setDraftQs(ds => {
        const out = ds.map((q, i) => {
            if (i !== qIdx) return q
            const newChoices = [...q.choices]
            const oldChoice = newChoices[cIdx]
            newChoices[cIdx] = choice
            const newAnswer = q.answer === oldChoice ? choice : q.answer
            return { ...q, choices: newChoices, answer: newAnswer }
        })
        return out
        })
    }
    const updateAnswer = (qIdx: number, answer: string) => {
        setDraftQs(ds => {
            const out = [...ds]
            out[qIdx] = { ...out[qIdx], answer: answer }
            return out
        })
    }

    return (
        <div className="bg-[#0D1117] min-h-screen flex flex-col">
        <Menu />

        <div className="flex-1 p-8 text-[#D1D5DB] space-y-6">
            <div className="relative flex flex-col md:flex-row items-center mb-10">
                <h2 className='p-2 px-8 border border-[#D1D5DB] rounded-2xl mb-4 md:mb-0'>Quiz</h2>
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
                                className="bg-[#3B82F6]"
                                onClick={handleStartQuiz}
                                disabled={saving}
                            >
                                {saving ? 'Saving…' : 'Start Quiz'}
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

            {(isEditing ? draftQs : qs).map((q, i) => (
            <div key={i} className="bg-[#D1D5DB] text-[#0F172A] rounded-xl p-6 space-y-4">
                {isEditing ? (
                <>
                    <div>
                    <label className="block font-semibold text-sm mb-1">
                        Q{i+1}:
                    </label>
                    <input
                        type="text"
                        className="w-full bg-white p-2 rounded outline-0"
                        value={q.question}
                        onChange={e => updateQuestion(i, e.target.value)}
                    />
                    </div>

                    <div className="space-y-2">
                    {q.choices.map((c, j) => (
                        <div key={j} className="flex items-center space-x-2">
                        <span className="font-medium">{String.fromCharCode(65+j)}.</span>
                        <input
                            type="text"
                            className="flex-1 bg-white p-1 rounded outline-0"
                            value={c}
                            onChange={e => updateChoice(i, j, e.target.value)}
                        />
                        </div>
                    ))}
                    </div>

                    <div>
                    <label className="block font-semibold text-sm mb-1">
                        Correct Answer:
                    </label>
                    <select
                        className="w-full bg-white p-2 rounded outline-0 truncate overflow-hidden whitespace-nowrap"
                        value={q.answer}
                        onChange={e => updateAnswer(i, e.target.value)}
                    >
                        {q.choices.map((c,j) => (
                        <option key={j} value={c}>
                            {String.fromCharCode(65+j)}. {c}
                        </option>
                        ))}
                    </select>
                    </div>
                </>
                ) : (
                <>
                    <h3 className="font-semibold mb-2">
                    Q{i + 1}: {q.question}
                    </h3>
                    <ul className="list-disc list-inside mb-2">
                    {q.choices.map((c, j) => (
                        <li key={j}>{c}</li>
                    ))}
                    </ul>
                    <p className="text-[#10B981]">Answer: {q.answer}</p>
                </>
                )}
            </div>
            ))}
        </div>

        <Footer />
        </div>
    )
}
