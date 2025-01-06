'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loader from '../components/Loader'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, confirmPassword, firstName, lastName }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Registration successful!', {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                });
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError('An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex justify-between flex-col">
            <ToastContainer />
            {loading && <Loader />}
            {/* Górny róg */}
            <div className="flex justify-start">
                <div className="h-32 bg-primary w-64 transform -skew-x-[25deg] -ml-10 flex items-center justify-center text-white">
                    <h1 className="text-center text-4xl font-semibold skew-x-[25deg] ">Shalom</h1>
                </div>
            </div>

            {/* Formularz rejestracji */}
            <div className="flex justify-center mt-[-4rem]">
                <div className="w-96 flex flex-col space-y-5 card p-10">
                    <h1 className="text-4xl text-primary font-semibold">Join us</h1>
                    <hr />

                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name"
                        className="border border-gray-300 h-10 rounded-sm focus:border-gray-500 pl-3"
                    />

                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name"
                        className="border border-gray-300 h-10 rounded-sm focus:border-gray-500 pl-3"
                    />

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e-mail"
                        className="border border-gray-300 h-10 rounded-sm focus:border-gray-500 pl-3"
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password"
                        className="border border-gray-300 h-10 rounded-sm focus:border-gray-500 pl-3"
                    />

                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="confirm password"
                        className="border border-gray-300 h-10 rounded-sm focus:border-gray-500 pl-3"
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-end">
                        <button
                            className="bg-primary h-10 rounded-sm text-white font-bold px-8"
                            onClick={handleSubmit}
                        >
                            Register
                        </button>
                    </div>

                    <hr />
                    <Link href="/login" className="font-semibold text-[15px] text-primary">
                        Already registered? Log in!
                    </Link>
                </div>
            </div>

            {/* Dolny róg */}
            <div className="flex justify-end mt-[-3.2rem]">
                <div className="h-32 bg-primary w-64 transform skew-x-[25deg] -mr-10 flex items-center justify-center text-white">
                    <h1 className="text-center text-4xl font-semibold -skew-x-[25deg] ">Hub</h1>
                </div>
            </div>
        </div>
    );
}
