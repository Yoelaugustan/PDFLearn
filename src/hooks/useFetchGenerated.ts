'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { GeneratedData, HistoryEntry, HistoryRow, Method, UpdatePayload } from '@/lib/types'

const supabase = createClient()

function getTableForMethod(method: Method) {
    switch (method) {
        case 'summary': return 'summaries'
        case 'quiz': return 'quizzes'
        case 'flashcards': return 'flashcards'
    }
}

export function useGenerated<T extends { id: string } = GeneratedData>(method: Method) {
    const table = getTableForMethod(method)
    const [data, setData] = useState<T | null>(null)
    const [fileName, setFileName] = useState<string>('') 
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string|null>(null)

    useEffect(() => {
        setLoading(true)
        ;(async () => {
        try {
            const docId = sessionStorage.getItem('pdf_docId')
            if (!docId) throw new Error('Missing document_id')
            const { data: row, error } = await supabase
                .from(table)
                .select('*')
                .eq('document_id', docId)
                .single()
            if (error) throw error
            setData(row)

            const { data: doc, error: docErr } = await supabase
                .from('documents')
                .select('name')
                .eq('id', docId)
                .single()
            if (docErr) throw docErr

            setFileName(doc.name)
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Unexpected error';
            setError(message);
        } finally {
            setLoading(false)
        }
        })()
    }, [table])

    const update = useCallback(
        async (payload: UpdatePayload) => {
            if (!data?.id) {
                throw new Error('No existing record to update')
            }
            setLoading(true)
            try {
                const changes: Record<string, unknown> = {}
                if (method === 'summary') {
                    const summaryPayload = payload as { summary?: string } | string
                    changes.summary_text = typeof summaryPayload === 'object' && summaryPayload.summary 
                        ? summaryPayload.summary 
                        : summaryPayload
                }
                if (method === 'quiz') changes.questions = payload
                if (method === 'flashcards') changes.cards = payload

                const { error } = await supabase
                    .from(table)
                    .update(changes)
                    .eq('id', data.id)
                if (error) throw error

                const { data: fresh, error: fetchErr } = await supabase
                    .from(table)
                    .select('*')
                    .eq('id', data.id)
                    .single()
                if (fetchErr) throw fetchErr
                setData(fresh)
                return true
            } catch (e: unknown) {
                const message = e instanceof Error ? e.message : 'Unknown error'
                setError(message)
                return false
            } finally {
                setLoading(false)
            }
        },
        [data, method, table]
    )

    return { data, fileName, loading, error, update }
}

export function useFetchHistory() {
    const [history, setHistory] = useState<HistoryEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isCancelled = false

        const fetchHistory = async () => {
            setLoading(true)
            try {
                const {
                    data: { user },
                    error: authError
                } = await supabase.auth.getUser()

                if (authError || !user) throw authError || new Error('User not authenticated')

                const { data: historyRows, error: historyError } = await supabase
                    .from('history')
                    .select('id, document_id, method, created_at')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })

                if (historyError) throw historyError
                if (!historyRows) return

                const docIds = historyRows.map(h => h.document_id)
                const { data: docs, error: docErr } = await supabase
                    .from('documents')
                    .select('id, name')
                    .in('id', docIds)

                if (docErr) throw docErr
                const docMap = new Map(docs?.map(doc => [doc.id, doc.name]))

                const list: HistoryEntry[] = historyRows.map(row => ({
                    id: row.id,
                    document_id: row.document_id,
                    method: row.method,
                    name: docMap.get(row.document_id) ?? 'Unknown',
                }))

                if (!isCancelled) {
                    setHistory(list)
                }

            } catch (e: unknown) {
                if (!isCancelled) {
                    const message = e instanceof Error ? e.message : 'Unexpected error'
                    setError(message)
                }
            } finally {
                if (!isCancelled) setLoading(false)
            }
        }

        fetchHistory()
        return () => { isCancelled = true }
    }, [])

    return { history, loading, error }
}

