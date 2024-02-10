import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await fetch('/api/admin/checkAdmin', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    setIsAdmin(true);
                }

            } catch (error) {
                console.error('Check admin error:', error);
            }
        };

        checkAdmin();
    }, []);

    const handleLogout = async () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    return (
        <nav>
            <div className="navbar bg-gray-900 mb-2 relative">
                <div className="md:text-xl flex-1">
                    <div className="navbar text-white">
                        <Link href='/main' id="logo" className="btn btn-ghost text-2xl">PayPor</Link>
                    </div>
                </div>

                <div className="hidden md:flex flex-1 justify-end text-white">
                    <Link className="btn btn-ghost" href="/main/#dashboard">แดชบอร์ด</Link>
                    <Link className="btn btn-ghost" href="/main/#payment">ชำระเงิน</Link>
                    {isAdmin && (
                        <Link className="btn btn-ghost" href="/admin">แอดมิน</Link>
                    )}
                </div>

                <div className="dropdown dropdown-end">
                    <div tabIndex="0" role="button" className="btn btn-ghost btn-circle text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <ul className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 text-left">
                        <li><Link href="/main/setting-profile">แก้ไขข้อมูล</Link></li>
                        <li><Link href="https://www.facebook.com/itsmeawkungz">ติดต่อแอดมิน</Link></li>
                        <li><button onClick={handleLogout}>ออกจากระบบ</button></li>
                    </ul>
                </div>
            </div>
            <div className="md:hidden flex-1 fixed bottom-0 right-0 m-4">
                <ul className="menu bg-base-200 rounded-box">
                    <li className='pb-3'>
                        <Link href='/main/#dashboard'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fill-rule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clip-rule="evenodd" />
                            </svg>

                        </Link>
                    </li>
                    <li>
                        <Link href='/main/#payment'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
                                <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
