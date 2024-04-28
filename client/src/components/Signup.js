


import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { NavLink, useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const [userType, setUserType] = useState('student'); // Default to student
  const [formData, setFormData] = useState({
    id: '',
    fullName: '',
    email: '',
    password: '',
    role: '',
    department: '',
  });

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.fullName || !formData.id || !formData.password || formData.role || !formData.department) {
      toast.error('Please fill all the required fields');
      return;
    }

    const regex = /^[A-Za-z\s]+$/;
    if (!regex.test(formData.fullName)) {
      toast.error('Please enter a valid name');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: formData.id,
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          department: formData.department,
          role: userType,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        console.log('User registered successfully');
        toast.success('Registration successful');
        navigate('/');

        // Redirect or show success message
      } else {
        console.error('Failed to register user');

        toast.error(data.message);
        // Handle error
      }
    } catch (error) {
      console.error('Error registering user:', error);
      // Handle error
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-blue-350 text-black">
      <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
        <div className="flex justify-center py-10 items-center bg-white">
          <form className="bg-white p-8 rounded-md shadow-2xl" onSubmit={handleSubmit}>
            <h1 className="text-gray-800 font-bold text-3xl mb-4">Sign Up</h1>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Select User</label>
              <select
                className="block w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-indigo-500"
                value={userType}
                onChange={handleUserTypeChange}
              >
                <option value="admin">Admin</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>
            <div className="flex items-center border-2 py-2 px-4 rounded-md mb-4">
              <input
                className="w-full outline-none border-none"
                type="text"
                name="fullName"
                id="fullName"
                placeholder="Full name"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center border-2 py-2 px-4 rounded-md mb-4">
              <input
                className="w-full outline-none border-none"
                type="email"
                name="email"
                id="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center border-2 py-2 px-4 rounded-md mb-4">
              {userType === 'student' && (
                <input
                  className="w-full outline-none border-none"
                  type="text"
                  name="id"
                  id="id"
                  placeholder="Please enter PRN"
                  value={formData.id}
                  onChange={handleInputChange}
                />
              )}
              {userType === 'faculty' && (
                <input
                  className="w-full outline-none border-none"
                  type="text"
                  name="id"
                  id="id"
                  placeholder="Please enter Faculty ID"
                  value={formData.id}
                  onChange={handleInputChange}
                />
              )}
              {userType === 'admin' && (
                <input
                  className="w-full outline-none border-none"
                  type="text"
                  name="id"
                  id="id"
                  placeholder="Please enter Admin ID"
                  value={formData.id}
                  onChange={handleInputChange}
                />
              )}
            </div>
            <div className="flex items-center border-2 py-2 px-4 rounded-md mb-4">
              <input
                className="w-full outline-none border-none"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Select Department</label>
              <select
                className="block w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-indigo-500"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
              >
                <option value="">Select Department</option>
                <option value="Computer Science">CSE</option>
                <option value="IT">IT</option>
                <option value="Electronics">E.Tronics</option>
                <option value="Mechanical">Mech</option>
                <option value="Electrical">Elec</option>
                <option value="Civil">Civil</option>
              </select>
            </div>
            <button
              type="submit"
              className="block w-full bg-indigo-600 mt-4 py-2 rounded-md text-white font-semibold"
            >
              Register
            </button>
            <div className="flex justify-end items-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <NavLink
                  to="/"
                  className="text-indigo-600 hover:underline cursor-pointer transition-all duration-300"
                >
                  Login
                </NavLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
