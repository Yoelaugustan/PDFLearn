'use client'
import React from 'react'
import Image from 'next/image'

export default function LoadingModal({ open, progressText }: { open: boolean, progressText?: string }) {
    if (!open) return null
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-black rounded-2xl p-6 flex flex-col items-center">
                <Image src="/Loading.gif" alt="Loading…" className="mb-4" width={100} height={100}/>
                <h1 className="text-white">{progressText}</h1>
            </div>
        </div>
    )
}
