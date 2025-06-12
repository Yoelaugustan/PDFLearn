'use client'
import React from 'react';
import {useDropzone} from 'react-dropzone';
import * as Icons from '@heroicons/react/24/solid'

export default function Dropzone() {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': [] },
    maxSize: 20 * 1024 * 1024,
  })

  return (
    <div
      {...getRootProps()}
      className="
        w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:w-[600px]
        h-[200px] sm:h-[220px] md:h-[250px]
        border-2 border-dashed border-[#6B7280]
        rounded-lg
        flex flex-col items-center justify-center
        cursor-pointer
        hover:border-[#D1D5DB]
        transition-colors
        mx-4 sm:mx-8 md:mx-0
        p-4
      "
    >
      <input {...getInputProps()} />

      <Icons.CloudArrowDownIcon className="w-20 sm:w-28 md:w-35 text-[#6B7280] mb-2 sm:mb-3 md:mb-4" />

      <div className='flex flex-col items-center justify-center w-full sm:w-[70%] md:w-[50%] mb-3 sm:mb-4 md:mb-5'>
        <p className="text-[#6B7280] text-xs sm:text-sm font-medium mb-1 sm:mb-2">Notes:</p>
        <ul className="text-[#6B7280] text-xs list-disc list-inside mb-1 sm:mb-2 space-y-1">
          <li>Must be PDF file</li>
          <li>Max file size 20 MB</li>
        </ul>
        <p className="text-[#6B7280] text-[9px] sm:text-[10px] text-center px-2 sm:px-4 leading-tight">
          *If your PDF has images, we'll try to read or describe them using AI. For best results, please upload PDFs with text only*
        </p>
      </div>
    </div>
  );
}