import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { register, resetStatus } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { STATUS } from "../../globals/status/status";
import { toast } from "react-toastify";
import Logo from '../../../assets/Logo.png';

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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded shadow-md">
        <div className="text-center mb-6">
          <a href="#">
            <img src={Logo} alt="logo" className="w-16 inline-block" />
          </a>
          <h4 className="text-slate-600 text-base mt-4">Sign up for your account</h4>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-800 text-sm font-medium mb-1">Full Name</label>
            <input
              name="name"
              value={userData.name}
              onChange={handleChange}
              type="text"
              className="bg-slate-100 w-full text-sm px-4 py-2 rounded focus:bg-transparent outline-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-slate-800 text-sm font-medium mb-1">Address</label>
            <input
              name="address"
              value={userData.address}
              onChange={handleChange}
              type="text"
              className="bg-slate-100 w-full text-sm px-4 py-2 rounded focus:bg-transparent outline-blue-500"
              placeholder="Enter your address"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-800 text-sm font-medium mb-1">Email</label>
              <input
                name="email"
                value={userData.email}
                onChange={handleChange}
                type="email"
                className="bg-slate-100 w-full text-sm px-4 py-2 rounded focus:bg-transparent outline-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-slate-800 text-sm font-medium mb-1">Phone</label>
              <input
                name="phone"
                value={userData.phone}
                onChange={handleChange}
                type="tel"
                className="bg-slate-100 w-full text-sm px-4 py-2 rounded focus:bg-transparent outline-blue-500"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-800 text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              value={userData.password}
              onChange={handleChange}
              type="password"
              className="bg-slate-100 w-full text-sm px-4 py-2 rounded focus:bg-transparent outline-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {errorMessage && (
            <div className="text-red-600 text-sm">{errorMessage}</div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-2 px-4 text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign up
            </button>
          </div>

          <div className="text-center text-sm text-slate-600 mt-2">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Login now
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
