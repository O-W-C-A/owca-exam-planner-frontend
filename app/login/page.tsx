'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '@/utils/axiosInstance';
import LoginForm from './LoginForm';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

export default function LoginPage() {
    const { fetchUser } = useUser();
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
        setIsLoading(true);

        try {
            // 1. Login
            const res = await api.post('/auth/login', {
                email: formData.email,
                passwordHash: formData.password,
            });

            const authData = res.data;
            const actualRole = authData.role.toLowerCase() === 'student' && authData.isLeader === true 
                ? 'studentleader' 
                : authData.role.toLowerCase();

            // 2. Set cookies
            Cookies.set('authToken', authData.token, { path: '/', sameSite: 'Strict', secure: true });
            Cookies.set('userId', String(authData.userId), { path: '/', sameSite: 'Strict', secure: true });
            Cookies.set('role', actualRole, {path: '/', sameSite: 'Strict', secure: true });

            if (actualRole === 'studentleader') {
                if (authData.groupId) {
                    Cookies.set('groupId', String(authData.groupId), {path: '/', sameSite: 'Strict', secure: true });
                }
                if (authData.groupName) {
                    Cookies.set('groupName', authData.groupName, {path: '/', sameSite: 'Strict', secure: true });
                }
            }

            // 3. Wait for user data to be loaded
            await fetchUser();

            // 4. Only redirect after user data is loaded
            const redirectPath = getRedirectPathFromRole(actualRole);
            router.push(redirectPath);
        } catch (err) {
            console.error('Login failed:', err);
            setError('Login failed. Please check your credentials and try again.');
            setIsLoading(false);
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
