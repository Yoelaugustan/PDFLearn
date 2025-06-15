import React from 'react'
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
    document_id: string
    name:string
    method: Method
}