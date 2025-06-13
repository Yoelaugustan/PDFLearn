'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/card'
import * as Icons from '@heroicons/react/24/solid'
import { Button } from '@/components/ui/button'

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
]

export default function method() {
    const [selected, setSelected] = useState<string | null>(null)
    const router = useRouter()

    return (
        <div className="bg-[#0D1117] min-h-screen flex flex-col items-center justify-center py-20 px-4">
            <h1 className="text-3xl md:text-4xl font-semibold text-[#D1D5DB] mb-12">
                Choose Learning Method
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
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
                onClick={() => selected && router.push(`/process/${selected}`)}
                disabled={!selected}
                className={`
                bg-[#3B82F6] hover:bg-[#2563EB] text-[#0D1117]
                font-medium text-base py-4 px-8 rounded-xl
                ${!selected ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                Continue
            </Button>
        </div>
    )
}
