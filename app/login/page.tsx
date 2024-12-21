'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '@/utils/axiosInstance'; // Adjust if necessary to point to your C# API endpoint
import LoginForm from './LoginForm';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        // Check if user is already logged in
        const token = Cookies.get('authToken');
        const role = Cookies.get('role')?.toLowerCase();

        if (token && role) {
            // Redirect based on role
            switch (role) {
                case 'student':
                    router.push('/dashboard/student/calendar');
                    break;
                case 'professor':
                    router.push('/dashboard/professor/calendar');
                    break;
                case 'admin':
                    router.push('/dashboard/admin');
                    break;
                case 'secretary':
                    router.push('/dashboard/secretary');
                    break;
                case 'studentleader':
                    router.push('/dashboard/studentleader/calendar');
                    break;
                default:
                    router.push('/dashboard');
            }
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const { email, password } = formData;
        if (!email || !password) {
            setError('Both fields are required.');
            return false;
        }
        setError(null);
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const res = await api.post('/auth/login', {
                email: formData.email,
                passwordHash: formData.password, // hash the password before sending
            });

            const { token, role, userId } = res.data;

            // Store token and user data in cookies
            Cookies.set('authToken', token, { path: '/' });
            Cookies.set('role', role, { path: '/' });
            Cookies.set('userId', userId, { path: '/' });
            
            // Cookies.set('userInfo', JSON.stringify({ role, userId }), { path: '/' });

            // Redirect based on user role
            switch (role) {
                case 'Admin':
                    router.push('/dashboard/admin');
                    break;
                case 'Professor':
                    router.push('/dashboard/professor');
                    break;
                case 'Student':
                    router.push('/dashboard/student');
                    break;
                default:
                    setError('User with unsupported role');
            }
        } catch (err) {
            console.error('Login failed', err);
            setError('Login failed, please try again.');
        }
    };

    if (!mounted) {
        return null; // Or a loading state
    }

    // Only show login form if not already logged in
    return (
        <LoginForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            error={error}
        />
    );
}
