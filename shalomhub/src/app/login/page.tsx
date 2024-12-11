import Link  from "next/link";

export default function Login() {
    return (
        <div className="h-screen flex justify-between flex-col overflow-hidden">
            {/* górny róg */}
            <div className="flex justify-start">
                <div className="h-32 bg-primary w-64 transform -skew-x-[25deg] -ml-10 flex items-center justify-center text-white">
                    <h1 className="text-center text-4xl font-semibold skew-x-[25deg] ">Shalom</h1>
                </div>
            </div>
            {/* form */}
            <div className="flex justify-center">
                <div className="w-96 flex flex-col space-y-5 card p-10">
                <h1 className="text-4xl text-primary font-semibold">Shalom!</h1>
                <hr />
                <input type="text" placeholder="e-mail" className="border border-gray-300 h-10 rounded-sm focus:border-gray-500 pl-3" />
                <input type="password" placeholder="password" className="border border-gray-300 h-10 rounded-sm focus:border-gray-500 pl-3 text-xl placeholder:text-base" />
                <div className="flex justify-end">
                    <button className="bg-primary h-10 rounded-sm text-white font-bold px-8">Log in</button>
                </div>
                <hr />
                <Link href='/register' className="font-semibold text-[15px] text-primary">Don't have an account yet? Sign Up!</Link>
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
