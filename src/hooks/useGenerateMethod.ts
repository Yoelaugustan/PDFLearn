import { useState } from 'react'
import { InferenceClient } from '@huggingface/inference'
import JSON5 from 'json5'

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

        let systemMsg   = ''
        let formatInstr = ''
        if (method === 'summary') {
            systemMsg   = 'You are a top-tier summarizer. Produce a concise but information-dense summary.'
            formatInstr = 'You are a JSON-only response machine. Reply with strict JSON: `{ "summary": string }` (no comments, single quotes, or trailing commas) and NOTHING ELSE—not a single word of explanation.'
        } else if (method === 'quiz') {
            systemMsg   = 'You are an expert educator. Create 20 multiple-choice questions maximum you could do less if you think is enough.'
            formatInstr = 'You are a JSON-only response machine. Reply with a strict JSON array of 20 objects: `[ { "question": string, "choices": [string], "answer": string }, … ]` (no comments, single quotes, or trailing commas) and NOTHING ELSE—not a single word of explanation.'
        } else {
            systemMsg   = 'You are a helpful tutor. Generate 20 flashcards maximum you could do less if you think is enough.'
            formatInstr = 'You are a JSON-only response machine. Reply with **one single** strict JSON array of 20 objects: `[ { "front": string, "back": string }, … ]` (no comments, single quotes, or trailing commas) and NOTHING ELSE—not a single word of explanation.'
        }

        const prompt = [
            systemMsg,
            formatInstr,
            '=== TEXT ===',
            text,
            '=== END ===',
        ].join('\n\n')

        try {
            const res = await client.chatCompletion({
                model: MODEL,
                messages: [
                    { role: 'system', content: systemMsg },
                    { role: 'user', content: prompt },
                ],
                parameters: {
                    max_new_tokens: 1500,
                    temperature: 0.0,
                    top_p: 0.1,
                },
            })

            const raw = res.choices?.[0]?.message?.content?.trim() || ''
            console.log('Raw HF reply:', raw)

            let jsonText: string
            const startArr = raw.indexOf('[')
            const endArr   = raw.lastIndexOf(']')
            if (startArr !== -1 && endArr > startArr) {
                jsonText = raw.slice(startArr, endArr + 1)
            } else {
                const startObj = raw.indexOf('{')
                const endObj   = raw.lastIndexOf('}')
                if (startObj !== -1 && endObj > startObj) {
                jsonText = raw.slice(startObj, endObj + 1)
                } else {
                throw new Error('No JSON found in HF response')
                }
            }

            jsonText = jsonText
                .replace(/\/\/.*$/gm, '')
                .replace(/,\s*([\]}])/g, '$1')

            let parsed: any
            try {
                parsed = JSON.parse(jsonText)
            } catch (e1) {
                console.warn('JSON.parse failed, falling back to JSON5:', e1)
                try {
                parsed = JSON5.parse(jsonText)
                } catch (e2) {
                console.error('JSON5.parse also failed:', e2, '\nCleaned text:', jsonText)
                throw new Error('Invalid JSON after cleaning')
                }
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
