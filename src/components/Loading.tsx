// components/LoadingModal.tsx
'use client'
import React from 'react'

export default function LoadingModal({ open, progressText }: { open: boolean, progressText?: string }) {
    if (!open) return null
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-black rounded-2xl p-6 flex flex-col items-center">
                <img src="/Loading.gif" alt="Loading…" className="w-50 h-50 mb-4" />
                <p className="text-white">{progressText}</p>
            </div>
        </div>
    )
}
