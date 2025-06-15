'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { Q, Card, HistoryEntry, Method } from '@/lib/types'

const supabase = createClient()

function getTableForMethod(method: Method) {
    switch (method) {
        case 'summary': return 'summaries'
        case 'quiz': return 'quizzes'
        case 'flashcards': return 'flashcards'
    }
}

export function useGenerated(method: Method) {
    const table = getTableForMethod(method)
    const [data, setData] = useState<any>(null)
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
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
        })()
    }, [table])

    const update = useCallback(
        async (payload: any) => {
            if (!data?.id) {
                throw new Error('No existing record to update')
            }
            setLoading(true)
            try {
                let changes: any = {}
                if (method === 'summary') changes.summary_text = payload.summary ?? payload
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
            } catch (e: any) {
                setError(e.message)
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
    const [error, setError] = useState<string|null>(null)

    useEffect(() => {
        setLoading(true)
        supabase
        .from('history')
        .select(`
            id,
            document_id,
            method,
            created_at,
            documents!history_document_id_fkey(name)
        `)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
            if (error) {
                setError(error.message)
            } else if (data) {
                const list = data.map((row: any) => ({
                    id:          row.id,
                    document_id: row.document_id,
                    method:      row.method,
                    created_at:  row.created_at,
                    name:        row.documents.name as string
                }))
                setHistory(list)
            }
        })
        .then(() => setLoading(false))
    }, [])

    return { history, loading, error }
}
