'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Signups = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMessages, setErrorMessages] = useState([]);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createUser = async (e) => {
    e.preventDefault();
    setErrorMessages([]);

    // Password confirmation validation
    if (form.password !== form.confirmPassword) {
      setErrorMessages([{ msg: 'Passwords do not match.' }]);
      return;
    }

    try {
      const response = await fetch('/apis/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
        credentials: 'include', // Include credentials in the request
      });

      const result = await response.json();

      if (response.ok && !result.errors) {
        localStorage.setItem('token', result.authtoken);
        console.log('Your account has been created successfully.');
        router.push('/');
      } else if (result.errors) {
        setErrorMessages(result.errors);
      } else {
        setErrorMessages([{ msg: 'An unknown error occurred.' }]);
      }
    } catch (error) {
      console.error('Error creating account:', error);
      setErrorMessages([{ msg: 'Server error. Please try again later.' }]);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md bg-white">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      <form onSubmit={createUser}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="name"
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="Enter your username"
            onChange={handleChange}
            value={form.name}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="Enter your email"
            onChange={handleChange}
            value={form.email}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="Enter your password"
            onChange={handleChange}
            value={form.password}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="Confirm your password"
            onChange={handleChange}
            value={form.confirmPassword}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
      {errorMessages.length > 0 && (
        <div className="mt-4 p-4 border border-red-600 bg-red-100 rounded-md">
          <h2 className="text-red-600 font-bold mb-2">Error:</h2>
          <ul className="list-disc ml-5">
            {errorMessages.map((error, index) => (
              <li key={index} className="text-red-600">
                {error.msg}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-4 text-sm text-center text-gray-700">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Log in here
        </Link>
        .
      </p>
    </div>
  );
};

export default Signups;
