'use client'
import Link from "next/link";
import React, { useState } from "react";

export default function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const register = async () => {
        try {
            
        } catch (error) {
            
        }
    }
    return (
        <div className="h-screen flex justify-between flex-col overflow-hidden">
            {/* górny róg */}
            <div className="flex justify-start">
                <div className="h-32 bg-primary w-64 transform -skew-x-[25deg] -ml-10 flex items-center justify-center text-white">
                    <h1 className="text-center text-4xl font-semibold skew-x-[25deg] ">Shalom</h1>
                </div>
            </div>
            {/* form */}
            <div className="flex justify-center mt-[-4rem]">
                <div className="w-96 flex flex-col space-y-5 card p-10">
                    <h1 className="text-4xl text-primary font-semibold">Join us</h1>
                    <hr />
                    <input type="text" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e-mail" 
                    className="border border-gray-300 h-10 rounded-sm focus:border-gray-500 pl-3" />

                    <input type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password" 
                    className="border border-gray-300 h-10 rounded-sm focus:border-gray-500 pl-3 text-xl placeholder:text-base" />

                    <input type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="confirm password" 
                    className="border border-gray-300 h-10 rounded-sm focus:border-gray-500 pl-3 text-xl placeholder:text-base" />
                    <div className="flex justify-end">
                        <button className="bg-primary h-10 rounded-sm text-white font-bold px-8" onClick={register}>Register</button>
                    </div>
                    <hr />
                    <Link href='/login' className="font-semibold text-[15px] text-primary">Already registered? Log in!</Link>
                </div>
            </div>
            {/* dolny róg */}
            <div className="flex justify-end mt-[-2.5rem]">
                <div className="h-32 bg-primary w-64 transform skew-x-[25deg] -mr-10 flex items-center justify-center text-white">
                    <h1 className="text-center text-4xl font-semibold -skew-x-[25deg] ">Hub</h1>
                </div>
            </div>
        </div>
    )
}
