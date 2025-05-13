'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from './components/LoginForm';

export default function Login() {
  const router = useRouter();

  return (
    <div className="h-screen flex justify-between flex-col overflow-hidden bg-white">
      <div className="flex justify-start">
        <div className="absolute top-0 h-32 bg-primary w-64 transform -skew-x-[25deg] -ml-10 flex items-center justify-center text-white">
          <h1 className="text-center text-4xl font-semibold skew-x-[25deg]">Shalom</h1>
        </div>
      </div>

      <LoginForm onLoginSuccess={() => router.push('/home')} />

      <div className="flex justify-end mt-[-2.5rem]">
        <div className="h-32 bg-primary w-64 transform skew-x-[25deg] -mr-10 flex items-center justify-center text-white">
          <h1 className="text-center text-4xl font-semibold -skew-x-[25deg]">Hub</h1>
        </div>
      </div>
    </div>
  );
}
