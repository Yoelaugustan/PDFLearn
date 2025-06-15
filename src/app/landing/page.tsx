'use client'
import React from 'react'
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

      <div className="flex-1 flex flex-col justify-center items-center py-8 md:py-15 px-4 space-y-12 md:space-y-16">
        {/* Get Started */}
        <div className="flex flex-col items-center space-y-4 md:space-y-6 w-full max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-semibold text-center text-[#D1D5DB] px-4">
            Get Started Now
          </h1>
          <Dropzone />
        </div>

        {/* What is PDFLearn */}
        <div className="flex flex-col items-center space-y-4 md:space-y-6 w-full max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-[#D1D5DB] px-4">
            What is PDFLearn?
          </h2>
          <p className="text-[#D1D5DB] max-w-2xl text-center text-sm md:text-base px-4">
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

          <p className="text-[#D1D5DB] max-w-2xl text-center text-sm md:text-base px-4">
            Whether you&apos;re a student reviewing lecture notes or a professional going through reports,
            PDFLearn helps you save time and study smarter — no need to copy-paste or highlight manually,
            just drop your file and let the AI do the rest.
          </p>
        </div>

        {/* How PDFLearn Works */}
        <div className="flex flex-col items-center space-y-6 w-full max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-[#D1D5DB] px-4">
            How PDFLearn Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 mt-5">
            {steps.map((s) => (
              <div key={s.number} className="relative">
                <div
                  className="
                    absolute -top-5 left-1/2 transform -translate-x-1/2
                    bg-[#0D1117] border-2 border-[#D1D5DB]
                    rounded-full w-10 h-10
                    flex items-center justify-center
                    text-sm text-[#D1D5DB]
                    z-20
                  "
                >
                  {s.number}
                </div>

                <Card
                  Icon={s.icon}
                  title={s.title}
                  description={s.desc}
                />
              </div>
            ))}
          </div>
        </div>

        <Button 
          className='relative bg-[#3B82F6] hover:bg-[#2563EB] text-[#0D1117] font-medium text-sm md:text-base py-4 md:py-5 w-full max-w-xs md:w-[35%] lg:w-[20%] rounded-xl mx-4'
          onClick={scrollToTop}
        >
          <p className='w-full text-center block'>Get Started Now</p>
          <Icons.ChevronRightIcon className='absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5'/>
        </Button>
      </div>

      <Footer />
    </div>
  )
}