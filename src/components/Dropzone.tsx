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
        w-[600px] h-[250px]
        border-2 border-dashed border-[#6B7280]
        rounded-lg
        flex flex-col items-center justify-center
        cursor-pointer
        hover:border-[#D1D5DB]
        transition-colors
      "
    >
      <input {...getInputProps()} />

      <Icons.CloudArrowDownIcon className="w-35 text-[#6B7280]" />

      <div className='flex flex-col items-center justify-center w-[50%] mb-5'>
        <p className="text-[#6B7280] text-sm font-medium">Notes:</p>
        <ul className="text-[#6B7280] text-xs list-disc list-inside mb-1">
          <li>Must be PDF file</li>
          <li>Max file size 20 MB</li>
        </ul>
        <p className="text-[#6B7280] text-[10px] text-center px-4">
          *If your PDF has images, we’ll try to read or describe them using AI. For best results, please upload PDFs with text only*
        </p>
      </div>
    </div>
  );
}