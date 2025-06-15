import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { cleanTextForPostgres } from '@/utils/cleanText'    

export function useDocumentUpload() {
    const router = useRouter()
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    async function uploadDocument(file: File, text: string) {
        setUploading(true)
        setError(null)

        const { data: buckets, error } = await supabase.storage.listBuckets()
        console.log(`List Bucket: ${buckets}`, error)

        try {
            const { data: { user }, error: userErr } = await supabase.auth.getUser()
            if (userErr || !user) throw new Error('User not authenticated')

            const safeFileName = file.name
                .normalize('NFKD')
                .replace(/[^\w.\-]/g, '_') 

            const path = `${user.id}/${Date.now()}_${safeFileName}`
            const { error: uploadErr } = await supabase
                .storage
                .from('pdfs')
                .upload(path, file)
            if (uploadErr) throw uploadErr

            const { data: doc, error: docErr } = await supabase
                .from('documents')
                .insert({
                    user_id: user.id,
                    name: file.name,
                    storage_key: path,
                })
                .select('id')
                .single()
            if (docErr || !doc) throw docErr || new Error('Document insert failed')

            sessionStorage.setItem('pdf_docId', String(doc.id))

            const safe = cleanTextForPostgres(text)

            const CHUNK_SIZE = 1000
            const chunks: {
                document_id: string
                chunk_index: number
                text: string
            }[] = []
            for (let i = 0; i < safe.length; i += CHUNK_SIZE) {
                chunks.push({
                    document_id: doc.id,
                    chunk_index: Math.floor(i / CHUNK_SIZE),
                    text: safe.slice(i, i + CHUNK_SIZE),
                })
            }
            const { error: chunkErr } = await supabase
                .from('document_chunks')
                .insert(chunks)
            if (chunkErr) throw chunkErr

            router.push('/method')
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : 'Upload failed';

            console.error('Document upload failed', err);
            setError(message);
        } finally {
            setUploading(false)
        }
    }

    return { uploadDocument, uploading, error }
}
