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
        w-full max-w-xs sm:w-64 md:w-72 lg:w-60
        h-48 sm:h-56 md:h-60
        p-4 sm:p-5 md:p-6
        flex flex-col items-center justify-start
        cursor-pointer
        hover:scale-105
        transition-transform
        mx-auto
      "
    >
      <Icon className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-[#0F172A] mt-1 sm:mt-2 mb-3 sm:mb-4" />

      <h3 className="text-base sm:text-lg font-medium text-[#0F172A] text-center mb-2 px-2">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[#0F172A] text-center px-2 leading-relaxed">
        {description}
      </p>
    </div>
  )
}