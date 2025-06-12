// components/Card.tsx
import { ComponentType } from 'react'
import { CardProps } from '@/lib/types'

export default function Card({
  Icon,
  title,
  description,
}: CardProps) {
  return (
    <div
      className="
        bg-[#D1D5DB]
        rounded-xl
        w-50 h-60
        p-6
        flex flex-col items-center justify-start
        cursor-pointer
        hover:scale-105
        transition-transform
      "
    >
      <Icon className="h-10 w-10 text-[#0F172A] mt-2 mb-4" />

      <h3 className="text-lg font-medium text-[#0F172A] text-center mb-2">
        {title}
      </h3>
      <p className="text-sm text-[#0F172A] text-center">
        {description}
      </p>
    </div>
  )
}
