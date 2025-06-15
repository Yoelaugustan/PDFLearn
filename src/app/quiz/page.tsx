'use client'
import React, { useEffect, useMemo, useState } from 'react'
import Menu from '@/components/Menu'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import * as Icons from '@heroicons/react/24/solid'
import { Q } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { useGenerated } from '@/hooks/useFetchGenerated'

export default function QuizPage() {
    const { data, fileName, loading, update } = useGenerated('quiz')
    const [qs, setQs] = useState<Q[]>([])
    const [draft, setDraft] = useState<Q[]>([])
    const [editing, setEditing] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (Array.isArray(data?.questions)) {
            const slice = (data.questions as Q[]).slice(0, 30)

            setQs(slice)
            setDraft(
                slice.map((q: Q) => ({
                    ...q,
                    choices: [...q.choices],
                }))
            )
        }
    }, [data])

    const isUnchanged = useMemo(() => {
        return JSON.stringify(draft) === JSON.stringify(qs)
    }, [draft, qs])

    const handleUpdate = async () => {
        if (editing) return
        const ok = await update(draft)
        if (ok) {
            setQs(draft)
            setEditing(false)
        }
        router.push('/quiz/start')
    }
    const updateQuestion = (i: number, t: string) => {
        const c = [...draft]; c[i].question = t
        setDraft(c)
    }
    const updateChoice = (qi: number, ci: number, txt: string) => {
        const c = draft.map((q, i) => {
            if (i !== qi) return q
            const ch = [...q.choices]; ch[ci] = txt
            const ans = q.answer === q.choices[ci] ? txt : q.answer
            return { ...q, choices: ch, answer: ans }
        })
        setDraft(c)
    }
    const updateAnswer = (i: number, ans: string) => {
        const c = [...draft]; c[i].answer = ans
        setDraft(c)
    }
    
    if (loading) return <div className="p-8 text-white">Loading…</div>

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
                    {!editing && (
                        <>
                            <Icons.PencilSquareIcon
                                className="w-6 h-6 cursor-pointer text-[#D1D5DB]"
                                onClick={() => setEditing(true)}
                            />
                            <Button
                                className="bg-[#3B82F6]"
                                onClick={handleUpdate}
                                disabled={editing}
                            >
                                { editing ? isUnchanged ? 'No changes' : 'Update': 'Start Quiz'}
                            </Button>
                        </>
                    )}
                    {editing && (
                        <>
                            <Icons.XMarkIcon
                                className="w-6 h-6 cursor-pointer text-[#D1D5DB]"
                                onClick={() => {setEditing(false); setQs(draft)}}
                            />
                        </>
                    )}
                </div>
            </div>

            <p className="text-sm text-gray-400 mb-6">
                {data
                    ? 'This Quiz is already in your database. Editing and clicking “Update” will overwrite the existing record (it won’t create a duplicate).'
                    : 'No Quiz found yet—editing and clicking “Update” will create it.'}
            </p>

            {(editing ? draft : qs).map((q, i) => (
                <div key={i} className="bg-[#D1D5DB] text-[#0F172A] rounded-xl p-6 space-y-4">
                    {editing ? (
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
