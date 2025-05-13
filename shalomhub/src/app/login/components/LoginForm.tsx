'use client';

import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../../components/Loader';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userId', data.userId);

        toast.success('Log in successful!', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
        });

        setTimeout(() => {
          onLoginSuccess();
        }, 2000);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError(`An error occurred during login: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="flex justify-center mt-[4rem]">
      <ToastContainer />
      {loading && <Loader />}
      <div className="w-96 flex flex-col space-y-5 card p-10">
        <h1 className="text-4xl text-primary font-semibold">Shalom!</h1>
        <hr />
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
          className="border border-gray-300 h-10 rounded-sm focus:border-gray-500 pl-3 text-xl placeholder:text-base"
        />
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
          Don&apos;t have an account yet? Sign Up!
        </Link>
      </div>
    </div>
  );
}
