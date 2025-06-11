'use client'

import React, { useState } from 'react'
import Menu from '../../../components/Menu'
import * as Icons from "@heroicons/react/24/solid";
import { Icon } from 'lucide-react';
import Google from '@/themes/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className='flex flex-col min-h-screen bg-[#0D1117]'>
        <Menu />

        <div className='flex flex-1 justify-center items-center'>
            <div className='bg-[#0D1117] border border-[#30363D] rounded-2xl px-14 py-12 shadow-md shadow-[#D1D5DB]'>
                
                <h1 className='text-3xl font-semibold text-center text-[#D1D5DB] mb-2'>Welcome</h1>
                
                <div className='text-center mb-6 flex gap-1 justify-center'>
                    <p className='text-[#6B7280]'>Already Have An Account?</p>
                    <p className='text-[#10FFCB] cursor-pointer'>
                        <Link href="/auth/login">Login</Link>
                    </p>
                </div>

                <div className='flex items-center gap-2 border border-[#D1D5DB] rounded-xl px-4 py-3 mb-3'>
                    <Icons.EnvelopeIcon className='text-[#D1D5DB] h-5 w-5'/>
                    <input
                        type='email'
                        placeholder='Email...'
                        className='bg-transparent outline-none text-[#D1D5DB] text-base w-full'
                    />
                </div>
                <div className='flex items-center justify-between border border-[#D1D5DB] rounded-xl px-4 py-3 mb-3'>
                    <div className='flex items-center gap-2'>
                        <Icons.LockClosedIcon className='text-[#D1D5DB] h-5 w-5'/>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Password...'
                            className='bg-transparent outline-none text-[#D1D5DB] text-base w-full'
                            
                        />
                    </div>
                    <div onClick={() => setShowPassword(prev => !prev)}>
                        {
                            showPassword ? (
                                <Icons.EyeIcon className='text-[#D1D5DB] h-5 w-5 cursor-pointer'/>
                            ) : (
                                <Icons.EyeSlashIcon className='text-[#D1D5DB] h-5 w-5 cursor-pointer'/>
                            )
                        }
                    </div>
                </div>
                <div className='flex items-center justify-between border border-[#D1D5DB] rounded-xl px-4 py-3 mb-6'>
                    <div className='flex items-center gap-2'>
                        <Icons.LockClosedIcon className='text-[#D1D5DB] h-5 w-5'/>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder='Confirm Password...'
                            className='bg-transparent outline-none text-[#D1D5DB] text-base w-full'
                            
                        />
                    </div>
                    <div onClick={() => setShowConfirmPassword(prev => !prev)}>
                        {
                            showConfirmPassword ? (
                                <Icons.EyeIcon className='text-[#D1D5DB] h-5 w-5 cursor-pointer'/>
                            ) : (
                                <Icons.EyeSlashIcon className='text-[#D1D5DB] h-5 w-5 cursor-pointer'/>
                            )
                        }
                    </div>
                </div>
                <div className='flex items-center gap-3 mb-6'>
                    <hr className='flex-1 h-px bg-[#D1D5DB]'/>
                    <p className='text-[#D1D5DB] text-sm'>OR</p>
                    <hr className='flex-1 h-px bg-[#D1D5DB]'/>
                </div>
                <div className='flex items-center gap-2 border border-[#D1D5DB] rounded-xl px-4 py-3 mb-6 cursor-pointer hover:bg-[#1F2937] transition'>
                    <Google className='text-[#D1D5DB] h-5 w-5'/>
                    <p className='text-[#D1D5DB] text-base'>Signin With Google Account</p>
                </div>

                <Button className='relative bg-[#3B82F6] hover:bg-[#2563EB] text-[#0D1117] font-medium text-base py-4 w-full rounded-xl'>
                    <p className='w-full text-center block'>Sign Up</p>
                    <Icons.ChevronRightIcon className='absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5'/>
                </Button>
            
            </div>
        </div>
    </div>
  )
}
