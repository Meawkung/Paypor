'use client'
import Link from 'next/link';
import { useState } from 'react';
import Navbar from '../components/navbar';


export default function ResetPassword() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();

    if (!password || !newPassword || !confirmNewPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('New password and confirmation do not match');
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
    <Navbar />
      <div className='px-6 lg:px-80 pt-20'>
        <form className="card-body">
          <div id="gra" className="font-sans font-bold text-xl pb-3">เปลี่ยนรหัสผ่านใหม่</div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">รหัสผ่านเดิม</span>
            </label>
            <input
              type="password"
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
          <div className="form-control">
            <label className="label">
              <span className="label-text">ยืนยันรหัสผ่านใหม่</span>
            </label>
            <input
              type="password"
              placeholder="Confirm New Password"
              className="input input-bordered"
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>
          <div className="form-control mt-6">
            <button className="btn btn-primary" onClick={handleReset}>ยืนยัน</button>
          </div>
          <p className='text-center' style={{ color: 'red' }}>{error}</p>
          <p className='text-center' style={{ color: 'green' }}>{success}</p>
        </form>
        <Link href="/main" className='underline block text-center mt-4'>กลับหน้าหลัก</Link>
      </div>
    </>
  );
}
