'use client'
import React, { useState } from 'react'
import Menu from '@/components/Menu'
import Dropzone from '@/components/Dropzone'
import Card from '@/components/card'
import * as Icons from '@heroicons/react/24/solid'
import { Button } from '@/components/ui/button'
import Footer from '@/components/footer'

export default function Landing() {
  const features = [
    {
      title: 'Summary',
      description: 'Get a quick overview of the key points',
      Icon: Icons.PencilSquareIcon,
    },
    {
      title: 'Quiz',
      description: 'Test your understanding with AI-generated questions',
      Icon: Icons.QuestionMarkCircleIcon,
    },
    {
      title: 'Flashcards',
      description: 'Turn important info into easy-to-review flashcards',
      Icon: Icons.RectangleStackIcon,
    },
  ]

  const steps = [
    {
      number: '01',
      title: 'Upload File',
      icon: Icons.DocumentArrowDownIcon,
      desc: 'our AI will read and understand your file',
    },
    {
      number: '02',
      title: 'Pick Learning Method',
      icon: Icons.Squares2X2Icon,
      desc: 'pick between our given methods (Quiz, Summary, FlashCard)',
    },
    {
      number: '03',
      title: 'Generate Chosen Method',
      icon: Icons.PrinterIcon,
      desc: 'our AI will generate your chosen method',
    },
    {
      number: '04',
      title: 'Happy Learning',
      icon: Icons.BookOpenIcon,
      desc: 'start studying and good luck :)',
    },
  ]

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="bg-[#0D1117] min-h-screen flex flex-col">
      <Menu />

      <div className="flex-1 flex flex-col justify-center items-center py-15 px-4 space-y-16">
        {/* Get Started */}
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-3xl font-semibold text-center text-[#D1D5DB]">
            Get Started Now
          </h1>
          <Dropzone />
        </div>

        {/* What is PDFLearn */}
        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-3xl font-semibold text-center text-[#D1D5DB]">
            What is PDFLearn?
          </h2>
          <p className="text-[#D1D5DB] max-w-2xl text-center">
            PDFLearn is a smart web app that helps you learn faster from your documents. Just upload a PDF,
            and our AI will read it, understand it, and let you choose what you want next.
          </p>

          <div className="flex flex-wrap gap-8 justify-center">
            {features.map((f) => (
              <Card
                key={f.title}
                Icon={f.Icon}
                title={f.title}
                description={f.description}
              />
            ))}
          </div>

          <p className="text-[#D1D5DB] max-w-2xl text-center">
            Whether you're a student reviewing lecture notes or a professional going through reports,
            PDFLearn helps you save time and study smarter — no need to copy-paste or highlight manually,
            just drop your file and let the AI do the rest.
          </p>
        </div>

        {/* How It Works */}
        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-3xl font-semibold text-center text-[#D1D5DB]">
            How PDFLearn Works
          </h2>

          <div className="flex items-center w-full max-w-3xl justify-between">
            {steps.map((s, i) => (
              <React.Fragment key={s.number}>
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full border border-gray-500 text-gray-300 flex items-center justify-center">
                    {s.number}
                  </div>
                </div>
                {i < steps.length - 1 && <div className="flex-1 h-px bg-gray-600 mx-2" />}
              </React.Fragment>
            ))}
          </div>

          <div className="flex flex-wrap gap-11 justify-center">
            {steps.map((s) => (
              <Card
                key={s.number}
                Icon={s.icon}
                title={s.title}
                description={s.desc}
              />
            ))}
          </div>
        </div>

        <Button 
          className='relative bg-[#3B82F6] hover:bg-[#2563EB] text-[#0D1117] font-medium text-base py-5 w-[15%] rounded-xl'
          onClick={scrollToTop}
        >
          <p className='w-full text-center block'>Get Started Now</p>
          <Icons.ChevronRightIcon className='absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5'/>
        </Button>
      </div>

      <Footer />
    </div>
  )
}
