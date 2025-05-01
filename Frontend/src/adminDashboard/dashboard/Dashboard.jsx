import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-white h-screen p-4">
        <h2 className="text-xl font-semibold mb-6">Admin Dashboard</h2>
        <ul>
          <li className="mb-4">
            <Link to="/admin/dashboard" className="hover:text-blue-400">Dashboard</Link>
          </li>
          <li className="mb-4">
            <Link to="/admin/manage-users" className="hover:text-blue-400">Manage Users</Link>
          </li>
          <li className="mb-4">
            <Link to="/addBook" className="hover:text-blue-400">Add book</Link>
          </li>
          <li className="mb-4">
            <Link to="/admin/reports" className="hover:text-blue-400">Reports</Link>
          </li>
          <li className="mb-4">
            <Link to="/admin/settings" className="hover:text-blue-400">Settings</Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6">
        <h1 className="text-3xl font-semibold mb-6">Welcome to the Admin Dashboard</h1>

        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 shadow-md rounded-md">
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-2xl">1,200</p>
          </div>
          <div className="bg-white p-4 shadow-md rounded-md">
            <h2 className="text-lg font-semibold">Total Products</h2>
            <p className="text-2xl">450</p>
          </div>
          <div className="bg-white p-4 shadow-md rounded-md">
            <h2 className="text-lg font-semibold">Total Orders</h2>
            <p className="text-2xl">1,800</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-4 shadow-md rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <ul>
            <li className="mb-2">
              <span className="font-semibold">John Doe</span> registered a new account
            </li>
            <li className="mb-2">
              <span className="font-semibold">Jane Smith</span> added a new product
            </li>
            <li className="mb-2">
              <span className="font-semibold">Alice Brown</span> placed a new order
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
