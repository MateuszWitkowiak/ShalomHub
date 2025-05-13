'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Loader from '@/app/components/Loader';

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {

        if (!email || !password || !confirmPassword || !firstName || !lastName) {
            setError('Please fill in all required fields.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setError(data.error || 'An error occurred during registration.');
            }
        } catch (error) {
            setError(`An error occurred: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <Loader />}
            <div className="relative top-14 flex justify-center mt-[-4rem]">
                <div className="w-96 max-w-full flex flex-col space-y-5 card p-10 max-h-[90vh]">
                    <h1 className="text-4xl text-primary font-semibold">Join us</h1>
                    <hr />

                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name"
                        onKeyDown={handleKeyPress}
                        className="border border-gray-300 h-10 rounded-sm focus:border-gray-500 pl-3"
                    />

                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name"
                        onKeyDown={handleKeyPress}
                        className="border border-gray-300 h-10 rounded-sm focus:border-gray-500 pl-3"
                    />

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e-mail"
                        onKeyDown={handleKeyPress}
                        className="border border-gray-300 h-10 rounded-sm focus:border-gray-500 pl-3"
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password"
                        onKeyDown={handleKeyPress}
                        className="border border-gray-300 h-10 rounded-sm focus:border-gray-500 pl-3"
                    />

                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="confirm password"
                        onKeyDown={handleKeyPress}
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
        </>
    );
}
