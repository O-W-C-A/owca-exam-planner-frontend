'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '@/utils/axiosInstance';
import LoginForm from './LoginForm';
import { useRouter } from 'next/navigation';
import { StudentAuthResponse, BaseAuthResponse } from '@/types/auth';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const getRedirectPathFromRole = (role: string): string => {
        switch (role) {
            case 'student':
                return '/dashboard/student/calendar';
            case 'studentleader':
                return '/dashboard/studentleader/calendar';
            case 'professor':
                return '/dashboard/professor/calendar';
            case 'admin':
                return '/dashboard/admin';
            case 'secretary':
                return '/dashboard/secretary';
            default:
                return '/dashboard';
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = Cookies.get('authToken');
                const role = Cookies.get('role')?.toLowerCase();

                if (token && role) {
                    const redirectPath = getRedirectPathFromRole(role);
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

            const authData = res.data;
            console.log('Auth data received:', authData); // Debug log

            // Store common data
            Cookies.set('authToken', authData.token, { path: '/' });
            Cookies.set('userId', String(authData.userId), { path: '/' });

            // Handle student leader case - compare with boolean true
            if (authData.role.toLowerCase() === 'student' && authData.isLeader === true) {
                console.log('Setting studentleader role'); // Debug log
                Cookies.set('role', 'studentleader', { path: '/' });
                if (authData.groupId) {
                    Cookies.set('groupId', String(authData.groupId), { path: '/' });
                }
                if (authData.groupName) {
                    Cookies.set('groupName', authData.groupName, { path: '/' });
                }
            } else {
                Cookies.set('role', authData.role.toLowerCase(), { path: '/' });
            }

            const redirectPath = getRedirectPathFromRole(authData.role.toLowerCase());
            console.log('Redirecting to:', redirectPath); // Debug log
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
