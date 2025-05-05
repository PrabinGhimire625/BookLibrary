// Login.js
import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { login } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from '../../../assets/Logo.png';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await dispatch(login(userData));
    if (user) {
      toast.success("Login successful");
      console.log("User role",user.role)
      if (user.role === "Admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } else {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-200 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-3xl shadow-xl">
          <div className="mb-6 text-center">
            <img
              src={Logo}
              alt="logo"
              className="w-20 mx-auto mb-4 hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h2 className="text-slate-900 text-3xl font-bold text-center mb-8">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                name="email"
                value={userData.email}
                onChange={handleChange}
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input
                name="password"
                value={userData.password}
                onChange={handleChange}
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between text-sm text-slate-700">
              <label className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-2">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-blue-600 hover:underline font-semibold">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-base font-semibold hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign in
            </button>

            <p className="text-sm text-center text-slate-800 mt-6">
              Don't have an account?
              <a href="/register" className="text-blue-600 hover:underline ml-1 font-semibold">
                Register here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
