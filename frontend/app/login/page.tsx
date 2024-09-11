/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useState } from 'react';
import { API_URL } from '../constant/apiUrl';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        alert('Login successful!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
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
                  <label className="text-gray-800 text-sm mb-2 block">User name</label>
                  <input
                    name="username"
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-4 focus:bg-transparent outline-blue-500 transition-all"
                    placeholder="Enter user name"
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
