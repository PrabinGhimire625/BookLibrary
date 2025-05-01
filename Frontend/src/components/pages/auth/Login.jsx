import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { login, resetStatus } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { STATUS } from "../../globals/status/status";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(userData));
  };

  useEffect(() => {
    if (status === STATUS.SUCCESS) {
      toast.success("Login successful");
      dispatch(resetStatus());
      navigate("/"); // Or any other route you want to redirect to
    } else if (status === STATUS.ERROR) {
      toast.error("Login failed. Please check your credentials.");
    } else {
      setErrorMessage("");
    }
  }, [status, navigate]);

  return (
    <div className="bg-gray-50">
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="max-w-md w-full">
          <a href="javascript:void(0)">
            <img
              src="https://readymadeui.com/readymadeui.svg"
              alt="logo"
              className="w-40 mb-8 mx-auto block"
            />
          </a>

          <div className="p-8 rounded-2xl bg-white shadow">
            <h2 className="text-slate-900 text-center text-3xl font-semibold">
              Sign in
            </h2>
            <form onSubmit={handleSubmit} className="mt-12 space-y-6">
              <div>
                <label className="text-slate-800 text-sm font-medium mb-2 block">
                  Email
                </label>
                <input
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  type="email"
                  required
                  className="w-full text-slate-800 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="text-slate-800 text-sm font-medium mb-2 block">
                  Password
                </label>
                <input
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  type="password"
                  required
                  className="w-full text-slate-800 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600"
                  placeholder="Enter your password"
                />
              </div>

              {errorMessage && (
                <div className="text-red-600 mt-4">{errorMessage}</div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm text-slate-800"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href="javascript:void(0)"
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div className="!mt-12">
                <button
                  type="submit"
                  className="w-full py-2 px-4 text-[15px] font-medium tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Sign in
                </button>
              </div>

              <p className="text-slate-800 text-sm !mt-6 text-center">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold"
                >
                  Register here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
