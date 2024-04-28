import React, { useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    if (!formData.id || !formData.password) {
      toast.error("Please fill in all details");
      return;
    }

    try {
      e.preventDefault();
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: formData.id,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Login Successful!");
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred during login");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-blue-350">
      <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3">
        <h1 className="text-black font-bold text-3xl mb-10 text-center font-roboto">
          Student MIS (Management Information System)
        </h1>

        {/* <h1 className="text-white-800 font-bold text-3xl mb-10 text-center">Student MIS (Management Information System)</h1> */}
        <form
          className="bg-white rounded-md shadow-2xl p-8"
          onSubmit={handleSubmit}
        >
          <h1 className="text-gray-800 font-bold text-3xl mb-6 text-center">
            Login
          </h1>

          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-600 text-sm mb-2">
              PRN / Faculty ID / Admin ID
            </label>
            <input
              id="email"
              className="w-full py-2 px-3 border border-gray-300 rounded-md outline-none focus:border-indigo-500"
              type="text"
              name="id"
              placeholder="Enter ID"
              value={formData.id}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-600 text-sm mb-2"
            >
              Password
            </label>
            <input
              id="password"
              className="w-full py-2 px-3 border border-gray-300 rounded-md outline-none focus:border-indigo-500"
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          <button
            type="submit"
            className="block w-full bg-indigo-600 py-3 rounded-md hover:bg-indigo-700 text-white font-semibold transition duration-300"
          >
            Login
          </button>

          <div className="mt-6 flex justify-end">
            <p className="text-sm text-gray-600">
              Don't have an account yet?{" "}
              <NavLink to="/signup" className="text-indigo-600 hover:underline">
                Signup
              </NavLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
