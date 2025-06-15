'use client'
import React, { useEffect, useMemo, useState } from 'react'
import Menu from '@/components/Menu'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import * as Icons from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import { useGenerated } from '@/hooks/useFetchGenerated'

export default function SummaryPage() {
    const { data, fileName, loading, error, update } = useGenerated('summary')
    const [isEditing, setIsEditing] = useState(false)
    const [draft, setDraft] = useState<string>('')
    const router = useRouter()
    
    const loadedText = useMemo(() => {
        return typeof data === 'object' && data !== null
        ? (data.summary_text as string)
        : ''
    }, [data])

    useEffect(() => {
        setDraft(loadedText)
    }, [loadedText])

    const isUnchanged = draft === loadedText

    const handleApply = async() => {
        if (isEditing) return
        const ok = await update(draft)
        if (ok) {
            setIsEditing(false)
        }
    }

    if (loading) return <div className="p-8 text-white">Loading…</div>

    return (
        <div className="bg-[#0D1117] min-h-screen flex flex-col">
            <Menu />
            <div className="flex-1 p-8 text-[#D1D5DB]">
                <div className="relative flex flex-col md:flex-row items-center mb-10">
                    <h2 className='p-2 px-8 border border-[#D1D5DB] rounded-2xl mb-4 md:mb-0'>Summary</h2>
                    <h2 className="text-2xl text-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">{fileName}</h2>
                    <div className="ml-auto">
                        <Button 
                            className="bg-[#3B82F6] hover:bg-[#2563EB] px-8"
                            onClick={handleApply}
                            disabled={loading || isUnchanged}
                        >
                            {loading ? 'Updating...' : isUnchanged ? 'No changes' : 'Update'}
                        </Button>
                    </div>
                </div>

                <p className="text-sm text-gray-400 mb-6">
                    {data
                        ? 'This summary is already in your database. Editing and clicking “Update” will overwrite the existing record (it won’t create a duplicate).'
                        : 'No summary found yet—editing and clicking “Update” will create it.'}
                </p>

                <div className="relative bg-[#D1D5DB] text-[#0F172A] rounded-xl p-6 pt-10 whitespace-pre-wrap mb-10">
                    {!isEditing && (
                        <>
                            <Icons.PencilSquareIcon 
                                className='w-5 h-5 absolute right-5 top-5 cursor-pointer text-[#0F172A]' 
                                onClick={()=>setIsEditing(true)}
                            />
                            <div>
                                {draft}
                            </div>
                        </>
                    )}
                    {isEditing && (
                        <>
                            <Icons.XMarkIcon 
                                className='w-5 h-5 absolute right-5 top-5 cursor-pointer text-[#0F172A]' 
                                onClick={() => setIsEditing(false)}
                            />
                            <textarea
                                className="w-full h-48 bg-[#D1D5DB] outline-none text-[#0F172A] p-2 rounded"
                                value={draft}
                                onChange={e=>setDraft(e.target.value)}
                            />
                        </>
                    )}
                </div>

                <div className="flex justify-center">
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
