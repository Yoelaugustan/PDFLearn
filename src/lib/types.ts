import { ComponentType } from 'react'

export type CardProps = {
    Icon: ComponentType<{ className?: string }>
    title: string
    description: string
    selected?: boolean
    onClick?: () => void
}

export type DropzoneProps = {
    onFileSelected?: (file: File) => void
    onContinue?: (file: File, text: string) => void
}

export type Q = { 
    question: string
    choices: string[] 
    answer: string 
}

export type Card = { 
    front: string
    back: string 
}

export type Method = 'summary' | 'quiz' | 'flashcards'

export interface HistoryEntry {
    id: string
    document_id: string
    name:string
    method: Method
}

export type HistoryRow = {
    id: string
    document_id: string
    method: Method
    created_at: string
    documents: { name: string }
}

type SummaryData = {
    id: string
    document_id: string
    summary_text: string
    created_at: string
}

type QuizData = {
    id: string
    document_id: string
    questions: Q[]
    created_at: string
}

type FlashcardsData = {
    id: string
    document_id: string
    cards: Card[]
    created_at: string
}

export type GeneratedData = SummaryData | QuizData | FlashcardsData

export type UpdatePayload = {
    summary?: string
} | Q[] | Card[] | string

export type OutputType = { summary: string } | Q[] | Card[] | null