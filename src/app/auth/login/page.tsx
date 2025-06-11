'use client'

import React, { useEffect, useState } from 'react'
import Menu from '../../../components/Menu'
import * as Icons from "@heroicons/react/24/solid";
import { Icon } from 'lucide-react';
import Google from '@/themes/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuthenticationActions } from '@/hooks/useAuthenticationActions';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const { login, signInWithGoogle, loading, error } = useAuthenticationActions()

    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                
                if (session?.user) {
                    console.log('User already authenticated, redirecting to landing...');
                    router.push('/landing');
                    return;
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
            } finally {
                setIsCheckingAuth(false);
            }
        };

        checkAuthStatus();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event);
                
                if (event === 'SIGNED_IN' && session) {
                    console.log('User signed in, redirecting to landing...');
                    router.push('/landing');
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [supabase, router]);

    const handleLogin = async () => {
        if(!email || !password) {
            alert('Please fill in all fields');
            return
        }
    
        try {
            await login(email, password);
        } catch(error) {
            console.log(error);
        }
    };

    if (isCheckingAuth) {
        return (
            <div className='flex flex-col min-h-screen bg-[#0D1117]'>
                <Menu />
                <div className='flex flex-1 justify-center items-center'>
                    <div className='text-[#D1D5DB] text-lg'>
                        Checking authentication...
                    </div>
                </div>
            </div>
        );
    }

  return (
    <div className='flex flex-col min-h-screen bg-[#0D1117]'>
        <Menu />

        <div className='flex flex-1 justify-center items-center'>
            <div className='bg-[#0D1117] border border-[#30363D] rounded-2xl px-14 py-12 shadow-md shadow-[#D1D5DB]'>
                
                <h1 className='text-3xl font-semibold text-center text-[#D1D5DB] mb-2'>Welcome back</h1>
                
                <div className='text-center mb-6 flex gap-1 justify-center'>
                    <p className='text-[#6B7280]'>Don't Have An Account?</p>
                    <p className='text-[#10FFCB] cursor-pointer'>
                        <Link href="/auth/signup">Sign Up</Link>
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
                <div className='flex items-center justify-between border border-[#D1D5DB] rounded-xl px-4 py-3 mb-6'>
                    <div className='flex items-center gap-2'>
                        <Icons.LockClosedIcon className='text-[#D1D5DB] h-5 w-5'/>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Password...'
                            className='bg-transparent outline-none text-[#D1D5DB] text-base w-full'
                            onChange={(e)=> setPassword(e.target.value)}
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
                <div className='flex items-center gap-3 mb-6'>
                    <hr className='flex-1 h-px bg-[#D1D5DB]'/>
                    <p className='text-[#D1D5DB] text-sm'>OR</p>
                    <hr className='flex-1 h-px bg-[#D1D5DB]'/>
                </div>
                <div className='flex items-center gap-2 border border-[#D1D5DB] rounded-xl px-4 py-3 mb-6 cursor-pointer hover:bg-[#1F2937] transition' onClick={signInWithGoogle}>
                    <Google className='text-[#D1D5DB] h-5 w-5'/>
                    <p className='text-[#D1D5DB] text-base'>Signin With Google Account</p>
                </div>

                <Button 
                    className='relative bg-[#3B82F6] hover:bg-[#2563EB] text-[#0D1117] font-medium text-base py-4 w-full rounded-xl'
                    onClick={handleLogin}
                    disabled={loading}
                >
                    <p className='w-full text-center block'>{loading ? 'Logging In...' : 'Login'}</p>
                    <Icons.ChevronRightIcon className='absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5'/>
                </Button>
            
            </div>
        </div>
    </div>
  )
}

