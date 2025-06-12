'use client'

import React from 'react'
import * as Icons from '@heroicons/react/24/solid'
import Linkedin, { Github } from '@/themes/icons'

export default function Footer() {
    return (
        <footer className="bg-[#0D1117] border-t border-[#D1D5DB] text-[#D1D5DB] py-5">
            <div className="max-w-4xl mx-auto text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                    <Icons.DocumentTextIcon className="h-7 w-7 text-[#D1D5DB]"/>
                    <h1 className="text-xl font-bold text-[#D1D5DB]">PDFLearn</h1>
                </div>

                <p className="text-sm">
                    Happy Studying and Good Luck<br />
                    Hope This Helps You!!
                </p>

                <div className="mt-2">
                    <p className="text-sm mb-2">My Socials:</p>
                    <div className="flex items-center justify-center space-x-2">
                        <a
                            href="https://github.com/Yoelaugustan"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors"
                        >
                            <Github />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/yoel-augustan-524a25291/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors"
                        >
                            <Linkedin />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
