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