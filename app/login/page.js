'use client'
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.success);
        setError('');
        localStorage.setItem('token', data.token);
        window.location.href = '/main';
      } else {
        setError(data.error);
        setSuccess('');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to login');
      setSuccess('');
    }
  };

  return (
    <>
      <div className="hero min-h-screen " style={{ backgroundImage: 'url(https://img.freepik.com/free-vector/dark-gradient-background-with-copy-space_53876-99548.jpg?w=1380&t=st=1706779364~exp=1706779964~hmac=f133a114ccf36078c1b8cdcd63d20ff2962c5da285feaea8dcb0ee6d4e1c7f75)' }}>
        <div className="hero-content flex-col">
          <h1 className="logo text-white">PayPor</h1>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body">
              <div id="gra" className="font-sans font-bold text-xl pb-3">LOGIN NOW</div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  className="input input-bordered"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="password"
                  className="input input-bordered"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary" onClick={handleLogin}>Login</button>
              </div>
              <p className='text-center' style={{ color: 'red' }}>{error}</p>
              <p className='text-center' style={{ color: 'green' }}>{success}</p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
