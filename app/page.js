'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import './globals.css';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // ตรวจสอบว่ามี token ใน localStorage หรือไม่
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); // กำหนดว่าเข้าสู่ระบบแล้วหากมี token ใน localStorage
    } else {
      setIsLoggedIn(false); // กำหนดว่ายังไม่ได้เข้าสู่ระบบหากไม่มี token ใน localStorage
    }
  }, []);

  return (
    <>
      <div className="hero h-screen relative" style={{ backgroundImage: 'url(https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg)', backgroundSize: 'cover' }}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 id="logo_main">PayPor</h1>
            <p className="mb-5"></p>
            {isLoggedIn ? ( // ถ้าเข้าสู่ระบบแล้ว
              <div className='text-center'>
                <p className='text-2xl'>สวัสดีคุณได้เข้าสู่ระบบแล้วไปยัง&nbsp;
                  <Link href="/main" className='link link-accent'>
                    หน้าหลัก
                  </Link>
                </p>
              </div>
            ) : (
              <div className='text-center'>
                <p className='text-2xl'>ยินดีต้อนรับสู่เว็บไซต์กดเพื่อ&nbsp;
                  <Link href="/login" className='link link-primary'>
                    เข้าสู่ระบบ
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
