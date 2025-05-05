import React from 'react';
import Sidebar from '../sidebar/Sidebar';

const Dashboard = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-full md:flex-1 p-4 sm:p-6 md:p-8">
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center md:text-left">
            🚀 Admin Dashboard
          </h1>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Users" value="1,200" />
            <StatCard title="Total Products" value="450" />
            <StatCard title="Total Orders" value="1,800" />
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📌 Recent Activity</h2>
            <ul className="space-y-3 text-gray-700 text-base">
              <li>
                <span className="font-semibold text-black">John Doe</span> registered a new account
              </li>
              <li>
                <span className="font-semibold text-black">Jane Smith</span> added a new product
              </li>
              <li>
                <span className="font-semibold text-black">Alice Brown</span> placed a new order
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100">
    <h2 className="text-lg font-semibold text-gray-700 mb-2">{title}</h2>
    <p className="text-3xl font-bold text-black">{value}</p>
  </div>
);

export default Dashboard;
