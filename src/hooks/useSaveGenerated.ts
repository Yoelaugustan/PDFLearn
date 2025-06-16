'use client'
import { useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Method, UpdatePayload } from '@/lib/types'

export function useSaveGenerated() {
    const supabase = createClient()
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string|null>(null)

    const save = useCallback(
        async (method: Method, payload: UpdatePayload) => {
        setSaving(true)
        setError(null)

        try {
            const {
                data: { user },
                error: authErr
            } = await supabase.auth.getUser()
            if (authErr || !user) throw authErr || new Error('Not authenticated')
            const user_id = user.id

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
                    summary_text: typeof payload === 'string'
                        ? payload
                        : (typeof payload === 'object' && 'summary' in payload && typeof payload.summary === 'string'
                            ? payload.summary
                            : '')
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

            const { error: insertError } = await supabase.from(table).upsert(row)
            if (insertError) throw insertError

            const { error: histErr } = await supabase
                .from('history')
                .insert({ user_id, document_id, method })
            if (histErr) throw histErr

            return true
        } catch (e: unknown) {
            console.error('save error', e)
            if (e instanceof Error) {
                setError(e.message)
            } else {
                setError('Unknown error')
            }
            return false
        } finally {
            setSaving(false)
        }},
        [supabase]
    )

    return { save, saving, error }
}
