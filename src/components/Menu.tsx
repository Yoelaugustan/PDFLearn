import React from 'react'
import * as Icons from "@heroicons/react/24/solid";

export default function menu() {
  return (
    <div className='bg-[#0D1117] p-5 shadow border-b-1 border-[#6B7280] justify-between flex'>
      <div className="flex items-center gap-2 cursor-pointer">
        <Icons.DocumentTextIcon className="h-7 w-7 text-[#D1D5DB]"/>
        <h1 className="text-xl font-bold text-[#D1D5DB]">PDFLearn</h1>
      </div>

      <div className='flex gap-6'>
        <h1 className="text-xl font-bold text-[#D1D5DB] cursor-pointer">History</h1>
        <Icons.Bars3Icon className="h-7 w-7 text-[#D1D5DB] cursor-pointer"/>
      </div>
    </div>
  )
}
