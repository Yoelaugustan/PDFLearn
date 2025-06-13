import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

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

            const path = `${user.id}/${Date.now()}_${file.name}`
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

            const CHUNK_SIZE = 1000
            const chunks = []
            for (let i = 0; i < text.length; i += CHUNK_SIZE) {
                chunks.push({
                document_id: doc.id,
                chunk_index: Math.floor(i / CHUNK_SIZE),
                text: text.slice(i, i + CHUNK_SIZE),
                })
            }
            const { error: chunkErr } = await supabase
                .from('document_chunks')
                .insert(chunks)
            if (chunkErr) throw chunkErr

            router.push('/method')
        } catch (err: any) {
            console.error('Document upload failed', err)
            setError(err.message || 'Upload failed')
        } finally {
            setUploading(false)
        }
    }

    return { uploadDocument, uploading, error }
}
