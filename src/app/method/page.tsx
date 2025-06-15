'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/card'
import * as Icons from '@heroicons/react/24/solid'
import { Button } from '@/components/ui/button'
import { useGenerateMethod } from '@/hooks/useGenerateMethod'
import Loading from '@/components/Loading'
import { useSaveGenerated } from '@/hooks/useSaveGenerated'

const methods = [
    { 
        key: 'summary',
        title: 'Summary',    
        description: 'Get a quick overview of the key points',       
        Icon: Icons.PencilSquareIcon 
    },
    { 
        key: 'quiz',        
        title: 'Quiz',       
        description: 'Test your understanding with AI-generated questions',   
        Icon: Icons.QuestionMarkCircleIcon 
    },
    { 
        key: 'flashcards',  
        title: 'Flashcards', 
        description: 'Turn important info into easy-to-review flashcards',      
        Icon: Icons.RectangleStackIcon 
    },
] as const

type MethodKey = (typeof methods)[number]['key']

export default function MethodPage() {
    const [selected, setSelected] = useState<MethodKey | null>(null)
    const router = useRouter()
    const { generate, loading, output, error } = useGenerateMethod()
    const { save, saving: savingToDb } = useSaveGenerated()

    useEffect(() => {
        if (!loading && output && selected) {
            sessionStorage.setItem(`pdf_${selected}`, JSON.stringify(output))
            save(selected, output).then((ok) => {
                if (ok) {
                    router.push(`/${selected}`)
                }
            })
        }
    }, [loading, output, selected, save, router])

    const handleContinue = () => {
        const text = sessionStorage.getItem('pdfText')
        if (!selected || !text) return
        generate(selected, text)
    }

    return (
        <div className="bg-[#0D1117] min-h-screen flex flex-col items-center justify-center py-20 px-4">
            <h1 className="text-3xl md:text-4xl font-semibold text-[#D1D5DB] mb-12 text-center">
                Choose Learning Method
            </h1>

            <div className="flex flex-wrap gap-8 justify-center mb-10">
                {methods.map((m) => (
                <Card
                    key={m.key}
                    Icon={m.Icon}
                    title={m.title}
                    description={m.description}
                    selected={selected === m.key}
                    onClick={() => setSelected(m.key)}
                />
                ))}
            </div>

            <Button
                onClick={handleContinue}
                disabled={!selected || loading || savingToDb}
                className={`
                    bg-[#3B82F6] hover:bg-[#2563EB] text-[#0D1117]
                    font-medium text-base py-4 px-8 rounded-xl
                    ${!selected ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                {loading|| savingToDb ? 'Generating…' : 'Continue'}
            </Button>

            <Loading open={loading || savingToDb} progressText={savingToDb ? `Saving ${selected}…` : `Generating ${selected}…`} />
        </div>
    )
}
