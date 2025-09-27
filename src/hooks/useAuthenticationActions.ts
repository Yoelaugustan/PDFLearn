import { useState } from 'react';
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation';


export function useAuthenticationActions() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient()

    const signOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);

        if (error) {
            setError(error.message);
        } else {
            router.push('/landing');
        }
    };

    const signUp = async (email: string, password: string) => {
        console.log('Signing up...');
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({ email, password, });

        setLoading(false);

        if (error) {
            setError(error.message);
        } else {
            router.push('/landing');
        }
    };

    const signInWithGoogle = async () => {
        console.log('Signing in with Google...');
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // Replace this with your actual deployed URL
                redirectTo: 'https://your-app.vercel.app/landing',
            },
        });

        if (error) {
            console.error('Google sign-in error:', error.message);
        }
    };


    return {
        loading,
        error,
        signOut,
        login,
        signUp,
        signInWithGoogle
    }
}