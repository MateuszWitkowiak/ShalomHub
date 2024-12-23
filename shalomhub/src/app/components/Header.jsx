'use client'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'
import '@fortawesome/fontawesome-free/css/all.css';

export default function Header() {
    const menuItems = [
        { title: "Home", path: "/home" },
        { title: "Add post", path: "/addpost" },
        { title: "Shares", path: "/shares" },
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
        <div className="p-5 bg-primary flex items-center">
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
                        onClick={handleLogout} 
                        className="border border-white p-1.5 rounded bg-primary text-white hover:bg-white hover:text-primary transition-all"
                    >
                        Logout
                    </button>
            </div>
        </div>
    );
}
