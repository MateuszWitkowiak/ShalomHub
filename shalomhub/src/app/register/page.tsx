'use client';
import RegisterForm from './components/RegisterForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RegisterPage() {
    return (
        <div className="h-screen flex justify-between flex-col overflow-x-hidden bg-white">
            <ToastContainer />

            <div className="flex justify-start">
                <div className="absolute top-0 left-0 h-32 bg-primary w-64 transform -skew-x-[25deg] -ml-10 flex items-center justify-center text-white">
                    <h1 className="text-center text-4xl font-semibold skew-x-[25deg] ">Shalom</h1>
                </div>
            </div>

            <RegisterForm />

            <div className="flex justify-end mt-[-3.2rem]">
                <div className="h-32 bg-primary w-64 transform skew-x-[25deg] -mr-10 flex items-center justify-center text-white">
                    <h1 className="text-center text-4xl font-semibold -skew-x-[25deg] ">Hub</h1>
                </div>
            </div>
        </div>
    );
}
