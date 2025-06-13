import { useState } from 'react'
import { InferenceClient } from '@huggingface/inference'

const HF_TOKEN = process.env.NEXT_PUBLIC_HF_TOKEN!
const MODEL = 'mistralai/mistral-7b-instruct-v0.2'

type Method = 'summary' | 'quiz' | 'flashcards'

export function useGenerateMethod() {
    const [loading, setLoading] = useState(false)
    const [output, setOutput] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const client = new InferenceClient(HF_TOKEN)

    async function generate(method: Method, text: string) {
        setLoading(true)
        setError(null)
        setOutput(null)

        let systemMsg = ''
        let formatInstruction = ''

        if (method === 'summary') {
            systemMsg = 'You are a top-tier summarizer. Produce a concise but information-dense summary.'
            formatInstruction = 'Respond with valid JSON: { "summary": string }. Do NOT escape underscores with backslashes or include trailing commas.'
        } else if (method === 'quiz') {
            systemMsg = 'You are an expert educator. Create up to 30 multiple-choice questions.'
            formatInstruction = 'Respond with a JSON array of exactly 30 objects: [{ "question": string, "choices": [string], "answer": string }, …]. Do NOT escape underscores or include trailing commas.'
        } else {
            systemMsg = 'You are a helpful tutor. Generate up to 30 flashcards.'
            formatInstruction = 'Respond with a JSON array of exactly 30 objects: [{ "front": string, "back": string }, …]. Do NOT escape underscores or include trailing commas.'
        }

        const prompt = [
            systemMsg,
            formatInstruction,
            'Here is the text:',
            text,
        ].join('\n\n')

        try {
            const result = await client.chatCompletion({
                model: MODEL,
                messages: [
                    { role: 'system', content: systemMsg },
                    { role: 'user', content: prompt },
                ],
                parameters: {
                    max_new_tokens: 1500,
                    temperature: 0.7,
                    top_p: 0.9,
                },
            })

            const raw = result.choices?.[0]?.message?.content?.trim() || ''
            console.log('Raw HF reply:', raw)

            const m = raw.match(/(\{[\s\S]*\})|(\[[\s\S]*\])/)?.[0]
            if (!m) throw new Error('No JSON found in model response')
            let jsonText = m

            jsonText = jsonText.replace(/\\_/g, '_')
            jsonText = jsonText.replace(/,\s*([}\]])/g, '$1')

            let parsed: any
            try {
                parsed = JSON.parse(jsonText)
            } catch (e: any) {
                console.error('Failed to parse JSON:', e)
                throw new Error('Invalid JSON returned from model')
            }

            setOutput(parsed)
        } catch (e: any) {
            console.error('generation error', e)
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    return { generate, loading, output, error }
}
