import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white shadow-inner border-t border-gray-200 py-10 px-4 md:px-10 text-gray-700">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Logo & Description */}
        <div>
          <h2 className="text-3xl font-extrabold text-indigo-700">
            Book<span className="text-green-600">Library</span>
          </h2>
          <p className="text-sm mt-3 text-gray-500">
            Discover, review, and collect your favorite reads all in one place.
          </p>
          <div className="flex space-x-4 mt-4 text-indigo-700 text-lg">
            <a href="https://www.facebook.com/prabin.ghimire.90281" className="hover:text-indigo-900"><FaFacebookF /></a>
            <a href="#" className="hover:text-indigo-900"><FaTwitter /></a>
            <a href="#" className="hover:text-indigo-900"><FaInstagram /></a>
            <a href="#" className="hover:text-indigo-900"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* My Account */}
        <div>
          <h3 className="text-lg font-semibold text-indigo-800 mb-4">My Account</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/myOrder" className="hover:text-indigo-600 transition">My Orders</Link></li>
            <li><Link to="/whiteList" className="hover:text-indigo-600 transition">Wishlist</Link></li>
            <li><Link to="/myOrder" className="hover:text-indigo-600 transition">My Reviews</Link></li>
            <li><Link to="/products" className="hover:text-indigo-600 transition">Browse Books</Link></li>
          </ul>
        </div>

        {/* Help & Info */}
        <div>
          <h3 className="text-lg font-semibold text-indigo-800 mb-4">Help & Info</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/myOrder" className="hover:text-indigo-600 transition">Returns & Cancellations</Link></li>
            <li><Link to="/faqs" className="hover:text-indigo-600 transition">FAQs</Link></li>
            <li><Link to="/contact" className="hover:text-indigo-600 transition">Contact Us</Link></li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="text-lg font-semibold text-indigo-800 mb-4">About</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-indigo-600 transition">About Us</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-indigo-600 transition">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-indigo-600 transition">Terms of Service</Link></li>
          </ul>
        </div>
      </div>


      {/* Copyright */}
      <div className="mt-12 text-center text-xs text-gray-400 border-t border-gray-100 pt-6">
        © {new Date().getFullYear()} BookLibrary. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
