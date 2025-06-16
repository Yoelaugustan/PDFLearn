import { useState, useEffect } from 'react'
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist'
import type { TextItem } from 'pdfjs-dist/types/src/display/api'
import Tesseract from 'tesseract.js'

GlobalWorkerOptions.workerSrc = '/pdf.worker.js'

export function usePdfScanner(file: File) {
    const [progress, setProgress] = useState(0)
    const [text, setText] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const [done, setDone] = useState(false)

    useEffect(() => {
        if (!file) return

        let isCancelled = false
        async function scan() {
            try {
                const arrayBuffer = await file.arrayBuffer()
                const pdf: PDFDocumentProxy = await getDocument({
                    data: arrayBuffer,
                }).promise.catch(err => {
                    if (!isCancelled) setError("PDF engine failed to load")
                    throw err
                });

                let fullText = ''

                for (let i = 1; i <= pdf.numPages; i++) {
                    if (isCancelled) break
                    const page: PDFPageProxy = await pdf.getPage(i)

                    const txtItems = (await page.getTextContent()).items as TextItem[]
                    const pageText = txtItems.map((it) => it.str).join(' ').trim()

                    if (pageText.length > 50) {
                        fullText += pageText + '\n\n'
                    } else {
                        const viewport = page.getViewport({ scale: 1.5 })
                        const canvas = document.createElement('canvas')
                        canvas.width = viewport.width
                        canvas.height = viewport.height
                        const ctx = canvas.getContext('2d')!
                        await page.render({ canvasContext: ctx, viewport }).promise

                        const { data: { text: ocrText } } = await Tesseract.recognize(
                        canvas,
                        'eng',
                        {
                            logger: m => {
                            if (m.status === 'recognizing text') {
                                const pct = (i - 1 + m.progress) / pdf.numPages
                                setProgress(Math.floor(pct * 100))
                            }
                            }
                        }
                        )
                        fullText += ocrText + '\n\n'
                    }

                    setProgress(Math.floor((i / pdf.numPages) * 100))
                }

                if (!isCancelled) {
                    console.log(fullText)
                    setText(fullText)
                    setDone(true)
                }
            } catch (err: unknown) {
                if (!isCancelled) {
                    if (err instanceof Error) {
                        setError(err.message)
                    } else {
                        setError('Scan failed')
                    }
                }
            }
        }

        scan()
        return () => { isCancelled = true }
    }, [file])

    return { progress, text, done, error }
}
