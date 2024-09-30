/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useState } from 'react';
import { API_URL } from '../constant/apiUrl';

const SignUpPage = () => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handlefirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };
  const handlelastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };
  const handlephoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };
  const handleemailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlepasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche la soumission du formulaire par défaut
 console.log('Form Data:', {
      email,
      password,
      firstName,
      lastName,
      phone,
    });
    if (!firstName || !lastName || !email || !password || !phone ) {
      alert('Please enter all data');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Add this header
        },
        body: JSON.stringify({ email: email, password : password, phone: phone, firstName: firstName, lastName: lastName}),
      });

      if (response.ok) {
        alert('User added successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user. Please try again.');
    }
  };

  return (
    <div>
      <div className="font-[sans-serif]">
        <div className="min-h-screen flex fle-col items-center justify-center p-6">
          <div className="grid lg:grid-cols-2 items-center gap-6 max-w-7xl max-lg:max-w-xl w-full">
          <form className="lg:max-w-md w-full" onSubmit={handleSubmit}>
              <h3 className="text-gray-800 text-3xl font-extrabold mb-12">
                Registration
              </h3>
              <div className="space-y-6">
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label className="text-gray-800 text-sm mb-2 block">First Name</label>
                    <input
                      name="firstName"
                      type="text"
                      value={firstName}
              onChange={handlefirstNameChange}
                      className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-4 focus:bg-transparent outline-blue-500 transition-all"
                      placeholder="First Name"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="text-gray-800 text-sm mb-2 block">Last Name</label>
                    <input
                      name="lastName"
                      type="text"
                      value={lastName}
                      onChange={handlelastNameChange}
                      className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-4 focus:bg-transparent outline-blue-500 transition-all"
                      placeholder="Last Name"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">Phone</label>
                  <input
                    name="phone"
                    type="number"
                    value={phone}
                    onChange={handlephoneChange}
                    className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-4 focus:bg-transparent outline-blue-500 transition-all"
                    placeholder="Enter phone"
                  />
                </div>
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">Email</label>
                  <input
                    name="email"
                    type="text"
                    value={email}
                    onChange={handleemailChange}
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
                    onChange={handlepasswordChange}
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
                  Create an account
                </button>
              </div>
              <p className="text-sm text-gray-800 mt-6">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-blue-600 font-semibold hover:underline ml-1"
                >
                  Login here
                </a>
              </p>
            </form>
            <div className="h-full max-lg:mt-12">
              <img
                src="https://readymadeui.com/login-image.webp"
                className="w-full h-full object-cover"
                alt="Dining Experience"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
