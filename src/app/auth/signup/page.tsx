'use client'
import React, { useState } from 'react'
import * as Icons from "@heroicons/react/24/solid";
import { Google } from '@/themes/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuthenticationActions } from '@/hooks/useAuthenticationActions';

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');

    const { signUp, signInWithGoogle, loading, error } = useAuthenticationActions();

    const handleSignUp = async () => {
        console.log('Signing up...');
        if(password !== confirmPassword) {
            alert('Passwords do not match');
            return
        }

        if(!email || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return
        }

        try {
            await signUp(email, password);
        } catch(error) {
            console.log(error);
        }
    }
  return (
    <div className='flex flex-col min-h-screen bg-[#0D1117]'>
        <div className='flex flex-1 flex-col justify-center items-center'>
            <div className="mb-8 flex items-center justify-center">
                <Icons.DocumentTextIcon className="h-10 w-10 text-[#D1D5DB]"/>
                <h1 className="text-3xl font-bold text-[#D1D5DB]">PDFLearn</h1>
            </div>

            <div className='bg-[#0D1117] border border-[#30363D] rounded-2xl px-14 py-12 shadow-md shadow-[#D1D5DB]'>
                
                <h1 className='text-3xl font-semibold text-center text-[#D1D5DB] mb-2'>Welcome</h1>
                
                <div className='text-center mb-6 flex gap-1 justify-center'>
                    <p className='text-[#6B7280]'>Already Have An Account?</p>
                    <p className='text-[#10FFCB] cursor-pointer'>
                        <Link href="/auth/login">Login</Link>
                    </p>
                </div>

                {error && (
                    <div className='bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-xl mb-4'>
                        {error}
                    </div>
                )}

                <div className='flex items-center gap-2 border border-[#D1D5DB] rounded-xl px-4 py-3 mb-3'>
                    <Icons.EnvelopeIcon className='text-[#D1D5DB] h-5 w-5'/>
                    <input
                        type='email'
                        placeholder='Email...'
                        className='bg-transparent outline-none text-[#D1D5DB] text-base w-full'
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='flex items-center justify-between border border-[#D1D5DB] rounded-xl px-4 py-3 mb-3'>
                    <div className='flex items-center gap-2'>
                        <Icons.LockClosedIcon className='text-[#D1D5DB] h-5 w-5'/>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Password...'
                            className='bg-transparent outline-none text-[#D1D5DB] text-base w-full'
                            onChange={(e) => setPassword(e.target.value)}
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
                            onChange={(e) => setConfirmPassword(e.target.value)}
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

                <Button 
                    className='relative bg-[#3B82F6] hover:bg-[#2563EB] text-[#0D1117] font-medium text-base py-4 w-full rounded-xl' 
                    onClick={handleSignUp}
                    disabled={loading}
                >
                    <p className='w-full text-center block'>{loading ? 'Signing Up...' : 'Sign Up'}</p>
                    <Icons.ChevronRightIcon className='absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5'/>
                </Button>
            
            </div>
        </div>
    </div>
  )
}
