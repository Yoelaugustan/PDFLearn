'use client'
import React, { useCallback, useEffect, useState } from 'react';
import {useDropzone} from 'react-dropzone';
import * as Icons from '@heroicons/react/24/solid'
import { DropzoneProps } from '@/lib/types';
import { Button } from './ui/button';
import { usePdfScanner } from '@/hooks/usePDFScanner';
import { useRouter } from 'next/navigation';
import { useDocumentUpload } from '@/hooks/useDocumentUpload'

export default function Dropzone({onFileSelected, onContinue}: DropzoneProps) {
  const [file, setFile] = useState<File | null>(null)
  const [scanFile, setScanFile] = useState<File | null>(null)
  const router = useRouter()

  const { progress, text, done, error } = usePdfScanner(scanFile)
  const { uploadDocument, uploading, error: uploadError } = useDocumentUpload()


  useEffect(() => {
    if (done && scanFile) {
      sessionStorage.setItem('pdfText', text)
      uploadDocument(scanFile, text)
      sessionStorage.setItem('pdfName', scanFile.name)
    }
  }, [done, scanFile, onContinue, text])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return
      const picked = acceptedFiles[0]
      setFile(picked)
      onFileSelected?.(picked)
    },
    [onFileSelected]
  )

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: { 'application/pdf': [] },
    maxSize: 20 * 1024 * 1024,
    onDrop,
    disabled: !!file,
  })

  const clear = () => {
    setFile(null)
  }

  return (
    <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:w-[600px] mx-4 sm:mx-8 md:mx-0">
      <div
        {...getRootProps()}
        className={`
          relative flex items-center justify-center w-full
          ${file
            ? 'border-2 border-green-500 bg-[#0D1117] p-3 rounded-2xl'
            : 'h-[200px] sm:h-[220px] md:h-[250px] border-2 border-dashed border-[#6B7280] rounded-lg bg-transparent hover:border-[#D1D5DB] cursor-pointer transition-colors'}
        `}
      >
        <input {...getInputProps()} />

        {!file ? (
          <div className="flex flex-col items-center justify-center w-full">
            <Icons.CloudArrowDownIcon className="w-20 sm:w-25 text-[#6B7280] mb-2 sm:mb-3 md:mb-4" />

            <div className="flex flex-col items-center justify-center w-full sm:w-[70%] md:w-[50%] mb-3 sm:mb-4 md:mb-5">
              <p className="text-[#6B7280] text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                Notes:
              </p>
              <ul className="text-[#6B7280] text-xs list-disc list-inside mb-1 sm:mb-2 space-y-1">
                <li>Must be PDF file</li>
                <li>Max file size 20 MB</li>
              </ul>
              <p className="text-[#6B7280] text-[9px] sm:text-[10px] text-center px-2 sm:px-4 leading-tight">
                *If your PDF has images, we'll try to read or describe them using AI.
                For best results, please upload text-only PDFs.*
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full px-4">
            <div className="flex items-center gap-2">
              <Icons.CheckCircleIcon className="h-6 w-6 text-green-500" />
              <div className="flex flex-col">
                <span className="text-gray-200 font-medium">{file.name}</span>
                <span className="text-gray-400 text-xs">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
            <button onClick={clear} className="p-1">
              <Icons.XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-200" />
            </button>
          </div>
        )}

        {fileRejections.length > 0 && (
          <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-red-500 text-xs">
            {fileRejections[0].errors[0].message}
          </p>
        )}
      </div>
      
      {file && (
        <div className="mt-4 text-center">
          <Button 
            onClick={() => setScanFile(file)}
            className='bg-[#3B82F6] hover:bg-[#2563EB] text-[#0D1117] font-medium text-sm sm:text-base py-4 sm:py-5 w-full max-w-xs sm:max-w-sm md:max-w-md rounded-xl'
          >
            <p className='w-full text-center block'>Continue</p>
          </Button>
        </div>
      )}

      {scanFile && !done && (
        <div className="fixed inset-0 bg-black/50 z-50 flex flex-col items-center justify-center p-4">
          <img src='/Scanning.gif' alt="Scanning…" className="w-24 h-24 mb-6" />
          <div className="w-full max-w-md bg-gray-700 rounded-full h-2 overflow-hidden mb-2">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white">{progress}%</p>
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </div>
      )}
    </div>

    
  );
}