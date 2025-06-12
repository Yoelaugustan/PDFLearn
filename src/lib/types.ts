import React from 'react'
import { ComponentType } from 'react'

export type CardProps = {
    Icon: ComponentType<{ className?: string }>
    title: string
    description: string
}

export type DropzoneProps = {
    onFileSelected?: (file: File) => void
    onContinue?: (file: File) => void
}