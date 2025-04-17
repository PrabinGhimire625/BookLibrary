import React from "react";

const Register = () => {
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

      <form>
        <div className="grid sm:grid-cols-2 gap-8">
          <div className="sm:col-span-2">
            <label className="text-slate-800 text-sm font-medium mb-2 block">Full Name</label>
            <input
              name="Name"
              type="text"
              className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter your full name"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-slate-800 text-sm font-medium mb-2 block">Address</label>
            <input
              name="Address"
              type="text"
              className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter your address"
            />
          </div>

          <div>
            <label className="text-slate-800 text-sm font-medium mb-2 block">Email</label>
            <input
              name="Email"
              type="email"
              className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="text-slate-800 text-sm font-medium mb-2 block">Phone</label>
            <input
              name="Phone"
              type="tel"
              className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="text-slate-800 text-sm font-medium mb-2 block">Password</label>
            <input
              name="Password"
              type="password"
              className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter your password"
            />
          </div>

        </div>

        <div className="mt-12">
          <button
            type="button"
            className="mx-auto block py-3 px-6 text-sm font-medium tracking-wider rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
