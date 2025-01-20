'use client'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.css';

export default function Header() {
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const menuItems = [
        { title: "Home", path: "/home" },
        { title: "Add post", path: "/addpost" },
        { title: "Events", path: "/events" },
        { title: "Chat", path: "/chat" },
        { title: "Notifications", path: "/notifications" },
        { title: "Profile", path: "/profile" },
    ];
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('userEmail');
        router.push('/login');
    };

    return (
        <div className="p-5 bg-primary flex items-center shadow-lg shadow-blue-500/50">
            <h5 className="text-white text-3xl font-semibold flex items-center ml-3">
                🕯️<i className="fas fa-star-of-david fa-fw mr-2"></i>
                ShalomHub
                <i className="fas fa-star-of-david fa-fw ml-2"></i>🕯️
            </h5>
            
            <div className="flex space-x-6 ml-auto text-white font-semibold mr-8">
                {menuItems.map((item) => (
                    <Link 
                        href={item.path} 
                        key={item.path} 
                        className={`border border-white p-1.5 rounded transition-all ${
                            pathname === item.path ? 'bg-white text-primary' : 'bg-primary text-white'
                        }`}
                    >
                        {item.title}
                    </Link>
                ))}
                <button 
                    onClick={() => {setLogoutModalVisible(true)}} 
                    className="border border-white p-1.5 rounded bg-primary text-white hover:bg-white hover:text-primary transition-all"
                >
                    Logout
                </button>
            </div>
            {logoutModalVisible && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-5 rounded shadow-lg">
                        <div className="mb-4">Are you sure you want to logout?</div>
                        <div className="flex space-x-4">
                            <button 
                                onClick={handleLogout} 
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-all"
                            >
                                Yes
                            </button>
                            <button 
                                onClick={() => {setLogoutModalVisible(false)}} 
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
