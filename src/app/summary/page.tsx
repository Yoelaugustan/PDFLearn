// app/summary/page.tsx
'use client'
import React, { useEffect, useState } from 'react'
import Menu from '@/components/Menu'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useSaveGenerated } from '@/hooks/useSaveGenerated'

export default function SummaryPage() {
    const [summary, setSummary] = useState<string>('')
    const [fileName, setFileName] = useState<string>('PDF Summary')
    const { save, saving, error } = useSaveGenerated()
    
    useEffect(() => {
        const raw = sessionStorage.getItem('pdf_summary') || '{}'
        try {
            const obj = JSON.parse(raw)
            setSummary(obj.summary ?? '')
        } catch {
            setSummary(raw)
        }

        const name = sessionStorage.getItem('pdfName')
        if (name) setFileName(name)
    }, [])

    const handleSave = () => {
        save('summary', summary)
    }

    return (
        <div className="bg-[#0D1117] min-h-screen flex flex-col">
            <Menu />
            <div className="flex-1 p-8 text-[#D1D5DB]">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl">{fileName}</h2>
                    <Button 
                        className="bg-[#3B82F6] hover:bg-[#2563EB]"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Saving' : 'Save'}
                    </Button>
                </div>

                <div className="bg-[#D1D5DB] text-[#0F172A] rounded-xl p-6 whitespace-pre-wrap">
                    {summary}
                </div>
            </div>
            <Footer />
        </div>
    )
}
