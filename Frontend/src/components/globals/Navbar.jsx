import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Logo from '../../assets/Logo.png';
import Profile from '../../assets/Profile.jpg';
import { FaShoppingCart } from "react-icons/fa";
import { resetStatus } from "../store/authSlice";
import { FiLogOut } from "react-icons/fi";
import { HiMenu } from "react-icons/hi";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const localStorageToken = localStorage.getItem('token');
    setIsLoggedIn(!!localStorageToken || !!token);
  }, [dispatch, token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    dispatch(resetStatus());
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-profile")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md w-full fixed z-50 top-0">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
        {/* Left: Logo and Search */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src={Logo} className="h-10 w-10 object-contain" alt="Logo" />
            <span className="text-2xl font-bold text-gray-800">BookLibrary</span>
          </Link>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search books..."
            className="px-3 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 w-64 ml-16 hidden md:block"
          />
        </div>

        {/* Center: Nav Links */}
        <div className="hidden md:flex justify-center flex-1 ml-8">
          <ul className="flex space-x-6 text-sm font-medium">
            {['Home', 'Products', 'About', 'Services', 'Contact'].map((item) => (
              <li key={item}>
                <Link
                  to={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                  className="text-gray-700 hover:text-blue-600"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-gray-700 text-2xl" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Login/Signup or Profile Dropdown */}
          {!isLoggedIn ? (
            <>
              <Link to="/register">
                <button className="px-4 py-1.5 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition duration-200">
                  Sign up
                </button>
              </Link>
              <Link to="/login">
                <button className="px-4 py-1.5 text-sm font-medium text-gray-700 border border-gray-400 rounded hover:bg-gray-100 transition duration-200">
                  Login
                </button>
              </Link>
            </>
          ) : (
            <div className="relative dropdown-profile">
              <img
                src={Profile}
                alt="Profile"
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-9 h-9 rounded-full object-cover border-2 border-gray-300 cursor-pointer"
              />

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded shadow-lg z-50">
                  <ul className="text-sm text-gray-700">
                    <li className="px-4 py-2 hover:bg-gray-100">
                      <Link to="/profile" onClick={() => setShowDropdown(false)}>Manage My Account</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100">
                      <Link to="/myOrder" onClick={() => setShowDropdown(false)}>My Orders</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100">
                      <Link to="/whiteList" onClick={() => setShowDropdown(false)}>My Wishlist</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100">
                      <Link to="/myOrder" onClick={() => setShowDropdown(false)}>My Reviews</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100">
                      <Link to="/myOrder" onClick={() => setShowDropdown(false)}>My Returns & Cancellations</Link>
                    </li>
                    <li
                      onClick={handleLogout}
                      className="px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer flex items-center"
                    >
                      <FiLogOut className="mr-2" /> Log out
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden flex items-center">
          <HiMenu
            className="text-gray-700 text-3xl cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="md:hidden bg-white shadow-md w-full fixed z-40 top-0 left-0 mt-16 px-4 py-2">
          <ul className="space-y-4">
            {['Home', 'Products', 'About', 'Services', 'Contact'].map((item) => (
              <li key={item}>
                <Link
                  to={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                  className="text-gray-700 hover:text-blue-600 block"
                  onClick={() => setShowMenu(false)}
                >
                  {item}
                </Link>
              </li>
            ))}
            <li>
              {!isLoggedIn ? (
                <>
                  <Link to="/login" onClick={() => setShowMenu(false)}>
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setShowMenu(false)}>
                    Sign up
                  </Link>
                </>
              ) : (
                <div>
                  <Link to="/profile" onClick={() => setShowMenu(false)}>Profile</Link>
                  <button
                    onClick={handleLogout}
                    className="mt-4 text-red-600"
                  >
                    Log out
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
