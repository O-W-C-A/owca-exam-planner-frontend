'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '@/utils/axiosInstance';
import LoginForm from './LoginForm';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = Cookies.get('authToken');
                const role = Cookies.get('role')?.toLowerCase();

                if (token && role) {
                    const redirectPath = getRedirectPath(role);
                    router.push(redirectPath);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    const getRedirectPath = (role: string): string => {
        switch (role) {
            case 'student':
                return '/dashboard/student/calendar';
            case 'professor':
                return '/dashboard/professor/calendar';
            case 'admin':
                return '/dashboard/admin';
            case 'secretary':
                return '/dashboard/secretary';
            case 'studentleader':
                return '/dashboard/studentleader/calendar';
            default:
                return '/dashboard';
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await api.post('/auth/login', {
                email: formData.email,
                passwordHash: formData.password,
            });

            const { token, role, userId } = res.data;

            Cookies.set('authToken', token, { path: '/' });
            Cookies.set('role', role, { path: '/' });
            Cookies.set('userId', userId, { path: '/' });

            const redirectPath = getRedirectPath(role.toLowerCase());
            router.push(redirectPath);
        } catch (err) {
            console.error('Login failed:', err);
            setError('Login failed. Please check your credentials and try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <LoginForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            error={error}
        />
    );
}
