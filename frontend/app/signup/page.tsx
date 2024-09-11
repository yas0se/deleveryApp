import React from 'react';
import createUser from './createUser';
import { FormEvent } from 'react'
import { API_URL } from '../constant/apiUrl';

const SignUpPage = () => {

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')
    const firstName = formData.get('firstName')
    const lastName = formData.get('lastName')
    const phone = formData.get('phone')

    console.log('Form Data:', {
      email,
      password,
      firstName,
      lastName,
      phone,
    });

    
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      body: formData,
    })

  }

  return (
    <div>
      <div className="font-[sans-serif]">
        <div className="min-h-screen flex fle-col items-center justify-center p-6">
          <div className="grid lg:grid-cols-2 items-center gap-6 max-w-7xl max-lg:max-w-xl w-full">
            <form className="lg:max-w-md w-full" onSubmit={onSubmit}>
              {/* <form className="lg:max-w-md w-full" action={createUser}> */}
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
                      className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-4 focus:bg-transparent outline-blue-500 transition-all"
                      placeholder="First Name"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="text-gray-800 text-sm mb-2 block">Last Name</label>
                    <input
                      name="lastName"
                      type="text"
                      className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-4 focus:bg-transparent outline-blue-500 transition-all"
                      placeholder="Last Name"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">Phone</label>
                  <input
                    name="phone"
                    type="text"
                    className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-4 focus:bg-transparent outline-blue-500 transition-all"
                    placeholder="Enter phone"
                  />
                </div>
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">Email</label>
                  <input
                    name="email"
                    type="text"
                    className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-4 focus:bg-transparent outline-blue-500 transition-all"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">Password</label>
                  <input
                    name="password"
                    type="password"
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
