import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid,
} from 'recharts';

const userGrowthData = [
  { month: 'Jan', users: 100 },
  { month: 'Feb', users: 200 },
  { month: 'Mar', users: 500 },
  { month: 'Apr', users: 1000 },
  { month: 'May', users: 2000 },
];

const popularBooks = [
  { title: 'Atomic Habits', borrowCount: 120 },
  { title: 'The Alchemist', borrowCount: 98 },
  { title: 'Rich Dad Poor Dad', borrowCount: 85 },
  { title: '1984', borrowCount: 70 },
  { title: 'The Power of Now', borrowCount: 65 },
];

const Dashboard = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />

      <div className="w-full md:flex-1 p-6 sm:p-8 md:p-10 xl:p-12">
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 xl:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center md:text-left">
            🚀 Admin Dashboard
          </h1>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            <StatCard title="Total Users" value="16" />
            <StatCard title="Total Books" value="20" />
            <StatCard title="Total Orders" value="21" />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* User Growth Line Chart */}
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">📈 Monthly User Growth</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={userGrowthData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Popular Books Bar Chart */}
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">📚 Top 5 Popular Books</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart layout="vertical" data={popularBooks} margin={{ left: 40 }}>
                  <XAxis type="number" />
                  <YAxis dataKey="title" type="category" />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Bar dataKey="borrowCount" fill="#10b981" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders Overview - Simple UI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Delivered Orders */}
            <div className="bg-green-50 border border-green-200 p-5 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold text-green-800 mb-2">Delivered Orders</h2>
              <p className="text-4xl font-bold text-green-700">12</p>
              <p className="text-sm text-green-600 mt-1">Orders delivered successfully</p>
            </div>

            {/* Pending Orders */}
            <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">Pending Orders</h2>
              <p className="text-4xl font-bold text-yellow-700">7</p>
              <p className="text-sm text-yellow-600 mt-1">Waiting for confirmation or in process</p>
            </div>

            {/* Cancelled Orders */}
            <div className="bg-red-50 border border-red-200 p-5 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold text-red-800 mb-2">Cancelled Orders</h2>
              <p className="text-4xl font-bold text-red-700">9</p>
              <p className="text-sm text-red-600 mt-1">Orders cancelled or failed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100">
    <h2 className="text-lg font-semibold text-gray-700 mb-2">{title}</h2>
    <p className="text-3xl font-bold text-black">{value}</p>
  </div>
);

export default Dashboard;
