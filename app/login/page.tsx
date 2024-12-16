'use client';

import { useState } from 'react';
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
    const router = useRouter();

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

            switch (res.data.role) {
                case 'admin':
                    Cookies.set('authToken', res.data.token); // Store token in cookie
                    router.push('/dashboard/admin');
                    break;
                case 'professor':
                    Cookies.set('authToken', res.data.token); // Store token in cookie
                    router.push('/dashboard/professor');
                    break;
                case 'student':
                    Cookies.set('authToken', res.data.token); // Store token in cookie
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

    return (
        <LoginForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            error={error}
        />
    );
}
