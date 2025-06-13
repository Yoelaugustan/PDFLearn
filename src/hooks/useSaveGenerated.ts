'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'

export type Method = 'summary' | 'quiz' | 'flashcards'

export function useSaveGenerated() {
    const supabase = createClient()
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string|null>(null)

    const save = useCallback(
        async (method: Method, payload: any) => {
        setSaving(true)
        setError(null)

        try {
            const docIdRaw = sessionStorage.getItem('pdf_docId')
            if (!docIdRaw) throw new Error('Missing document ID')
            const document_id = docIdRaw

            let table: string
            let row: Record<string, unknown>

            switch (method) {
            case 'summary':
                table = 'summaries'
                row = {
                    document_id,
                    summary_text: (payload.summary ?? payload) as string,
                }
                break

            case 'quiz':
                table = 'quizzes'
                row = {
                    document_id,
                    questions: payload,
                }
                break

            case 'flashcards':
                table = 'flashcards'
                row = {
                    document_id,
                    cards: payload,
                }
                break

            default:
                throw new Error(`Unknown method “${method}”`)
            }

            const { error: insertError } = await supabase.from(table).insert(row)
            if (insertError) throw insertError

            return true
        } catch (e: any) {
            console.error('save error', e)
            setError(e.message)
            return false
        } finally {
            setSaving(false)
        }},
        [supabase]
    )

    return { save, saving, error }
}
