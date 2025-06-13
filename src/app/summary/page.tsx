// app/summary/page.tsx
'use client'
import React, { useEffect, useState } from 'react'
import Menu from '@/components/Menu'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useSaveGenerated } from '@/hooks/useSaveGenerated'
import * as Icons from '@heroicons/react/24/solid'

export default function SummaryPage() {
    const [summary, setSummary] = useState<string>('')
    const [fileName, setFileName] = useState<string>('PDF Summary')
    const { save, saving, error } = useSaveGenerated()
    const [isEditing, setIsEditing] = useState(false)
    const [draft, setDraft] = useState<string>('')
    
    useEffect(() => {
        const raw = sessionStorage.getItem('pdf_summary') || '{}'
        try {
            const obj = JSON.parse(raw)
            setSummary(obj.summary ?? '')
            setDraft(obj.summary ?? '')
        } catch {
            setSummary(raw)
            setDraft(raw)
        }

        const name = sessionStorage.getItem('pdfName')
        if (name) setFileName(name)
    }, [])

    const handleSave = () => {
        save('summary', { summary: draft })
        setSummary(draft)
        sessionStorage.setItem('pdf_summary', JSON.stringify({ summary: draft }))
        setIsEditing(false)
    }

    const handleCancel = () => {
        setDraft(summary)
        setIsEditing(false)
    }

    return (
        <div className="bg-[#0D1117] min-h-screen flex flex-col">
            <Menu />
            <div className="flex-1 p-8 text-[#D1D5DB]">
                <div className="relative flex items-center mb-10">
                    <h2 className='p-2 px-8 border border-[#D1D5DB] rounded-2xl'>Summary</h2>
                    <h2 className="absolute left-1/2 transform -translate-x-1/2 text-2xl text-center">{fileName}</h2>
                    <div className="ml-auto">
                        <Button 
                            className="bg-[#3B82F6] hover:bg-[#2563EB] px-8"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? 'Saving' : 'Save'}
                        </Button>
                    </div>
                </div>

                <div className="relative bg-[#D1D5DB] text-[#0F172A] rounded-xl p-6 pt-10 whitespace-pre-wrap">
                    {!isEditing && (
                        <>
                            <Icons.PencilSquareIcon 
                                className='w-5 h-5 absolute right-5 top-5 cursor-pointer text-[#0F172A]' 
                                onClick={()=>setIsEditing(true)}
                            />
                            <div>
                                {summary}
                            </div>
                        </>
                    )}
                    {isEditing && (
                        <>
                            <Icons.XMarkIcon 
                                className='w-5 h-5 absolute right-5 top-5 cursor-pointer text-[#0F172A]' 
                                onClick={handleCancel}
                            />
                            <textarea
                                className="w-full h-48 bg-[#D1D5DB] outline-none text-[#0F172A] p-2 rounded"
                                value={draft}
                                onChange={e=>setDraft(e.target.value)}
                            />
                        </>
                    )}
                </div>


            </div>
            <Footer />
        </div>
    )
}
