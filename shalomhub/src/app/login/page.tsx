'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loader from '../components/Loader'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('userEmail', email)
                toast.success('Log in successful!', {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                });
                setTimeout(() => {
                    router.push('/home');
                }, 2000);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError('An error occurred during login');
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="h-screen flex justify-between flex-col overflow-hidden">
            <ToastContainer />
            {loading && <Loader />}
            {/* górny róg */}
            <div className="flex justify-start">
                <div className="absolute top-0 h-32 bg-primary w-64 transform -skew-x-[25deg] -ml-10 flex items-center justify-center text-white">
                    <h1 className="text-center text-4xl font-semibold skew-x-[25deg]">Shalom</h1>
                </div>
            </div>

            {/* formularz */}
            <div className="flex justify-center mt-[4rem]">
                <div className="w-96 flex flex-col space-y-5 card p-10">
                    <h1 className="text-4xl text-primary font-semibold">Shalom!</h1>
                    <hr />
                    {/* Pole email */}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e-mail"
                        className="border border-gray-300 h-10 rounded-sm focus:border-gray-500 pl-3"
                    />
                    {/* Pole hasło */}
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password"
                        className="border border-gray-300 h-10 rounded-sm focus:border-gray-500 pl-3 text-xl placeholder:text-base"
                    />
                    {/* Komunikat błędu */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end">
                        <button
                            className="bg-primary h-10 rounded-sm text-white font-bold px-8"
                            onClick={handleLogin}
                        >
                            Log in
                        </button>
                    </div>
                    <hr />
                    <Link href="/register" className="font-semibold text-[15px] text-primary">
                        Don't have an account yet? Sign Up!
                    </Link>
                </div>
            </div>

            {/* dolny róg */}
            <div className="flex justify-end mt-[-2.5rem]">
                <div className="h-32 bg-primary w-64 transform skew-x-[25deg] -mr-10 flex items-center justify-center text-white">
                    <h1 className="text-center text-4xl font-semibold -skew-x-[25deg]">Hub</h1>
                </div>
            </div>
        </div>
    );
}
