'use client'
import Link from 'next/link';
import { useState } from 'react';

export default function ResetPassword() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();


    if (!password || !newPassword) {
      setError('Please enter old and new password');
      return;
    }

    try {
      const response = await fetch('/api/setpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.success);
        setError('');
        window.location.href = '/login';
        document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      } else {
        setError(data.error);
        setSuccess('');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Failed to reset password');
      setSuccess('');
    }
  }

  return (
    <>
      <div className='px-60 pt-20'>
        <form className="card-body">
          <div id="gra" className="font-sans font-bold text-xl pb-3">เปลี่ยนรหัสผ่านใหม่</div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">รหัสผ่านเดิม</span>
            </label>
            <input
              type="email"
              placeholder="Old Password"
              className="input input-bordered"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">รหัสผ่านใหม่</span>
            </label>
            <input
              type="password"
              placeholder="New Password"
              className="input input-bordered"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="form-control mt-6">
            <button className="btn btn-primary" onClick={handleReset}>ยืนยัน</button>
          </div>
          <p className='text-center' style={{ color: 'red' }}>{error}</p>
          <p className='text-center' style={{ color: 'green' }}>{success}</p>
        </form>
        <Link href="/main" className='underline'>กลับหน้าหลัก</Link>
      </div>
    </>
  );
}