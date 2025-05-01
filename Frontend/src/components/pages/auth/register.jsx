import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { register, resetStatus } from "../../store/authSlice";

import { useNavigate } from "react-router-dom";
import { STATUS } from "../../globals/status/status";
import { toast } from "react-toastify";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);
  const [errorMessage, setErrorMessage] = useState("");

  const [userData, setUserData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(userData));
  };

  useEffect(() => {
    if (status === STATUS.SUCCESS) {
      toast.success("Register successful");
      dispatch(resetStatus());
      navigate("/login");
    } else if (status === STATUS.ERROR) {
      toast.error("Registration failed. Please check your details.");
    } else {
      setErrorMessage("");
    }
  }, [status, navigate]);

  return (
    <div className="max-w-4xl max-sm:max-w-lg mx-auto p-6 mt-6">
      <div className="text-center mb-12 sm:mb-16">
        <a href="#">
          <img
            src="https://readymadeui.com/readymadeui.svg"
            alt="logo"
            className="w-44 inline-block"
          />
        </a>
        <h4 className="text-slate-600 text-base mt-6">Sign up for your account</h4>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 gap-8">
          <div className="sm:col-span-2">
            <label className="text-slate-800 text-sm font-medium mb-2 block">Full Name</label>
            <input
              name="name"
              value={userData.name}
              onChange={handleChange}
              type="text"
              className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-slate-800 text-sm font-medium mb-2 block">Address</label>
            <input
              name="address"
              value={userData.address}
              onChange={handleChange}
              type="text"
              className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter your address"
              required
            />
          </div>

          <div>
            <label className="text-slate-800 text-sm font-medium mb-2 block">Email</label>
            <input
              name="email"
              value={userData.email}
              onChange={handleChange}
              type="email"
              className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="text-slate-800 text-sm font-medium mb-2 block">Phone</label>
            <input
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              type="tel"
              className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-slate-800 text-sm font-medium mb-2 block">Password</label>
            <input
              name="password"
              value={userData.password}
              onChange={handleChange}
              type="password"
              className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        {errorMessage && (
          <div className="text-red-600 mt-4">{errorMessage}</div>
        )}

        <div className="mt-12">
          <button
            type="submit"
            className="mx-auto block py-3 px-6 text-sm font-medium tracking-wider rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            Sign up
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Login now
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
