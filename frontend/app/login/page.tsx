/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useState } from 'react';
import { API_URL } from '../constant/apiUrl';
import { useRouter } from 'next/navigation'

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter()

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        alert('Login successful!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
      const data= await response.json()
      console.log('response: ', data)
      localStorage.setItem('token', data.token);
      router.push('/colis')
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Failed to login. Please try again.');
    }
  };
  

  return (
    <div>
      <div className="font-[sans-serif]">
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="grid lg:grid-cols-2 items-center gap-6 max-w-7xl max-lg:max-w-xl w-full">
            <form className="lg:max-w-md w-full" onSubmit={handleSubmit}>
              <h3 className="text-gray-800 text-3xl font-extrabold mb-12">
                Sign in
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">Email</label>
                  <input
                    name="email"
                    type="text"
                    value={email}
                    onChange={handleEmailChange}
                    className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-4 focus:bg-transparent outline-blue-500 transition-all"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">Password</label>
                  <input
                    name="password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-4 focus:bg-transparent outline-blue-500 transition-all"
                    placeholder="Enter password"
                  />
                </div>
              </div>
              <div className="mt-12">
                <button
                  type="submit"
                  className="py-4 px-8 text-sm font-semibold text-white tracking-wide bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Log in
                </button>
              </div>
              <p className="text-sm text-gray-800 mt-6">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-blue-600 font-semibold hover:underline ml-1"
                >
                  Register here
                </a>
              </p>
            </form>
            <div className="h-full max-lg:mt-12">
              <img
                src="https://readymadeui.com/login-image.webp"
                className="w-full h-full object-cover"
                alt="Login Illustration"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
