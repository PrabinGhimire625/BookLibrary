import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addCategory } from '../../components/store/categorySlice';
import { STATUS } from '../../components/globals/status/status';
import Sidebar from '../sidebar/Sidebar';
import { resetStatus } from '../../components/store/categorySlice';

const AddCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector(state => state.category);
  console.log("status", status )

  const [categoryData, setCategoryData] = useState({
    categoryName: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addCategory(categoryData));
    if (status === STATUS.SUCCESS) {
      toast.success("Category added successfully!");
      dispatch(resetStatus()); 
      navigate('/listCategory');
    } else if (status === STATUS.ERROR) {
      toast.error("Failed to add category.");
      dispatch(resetStatus()); 
    }
  };

 

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 ">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area aligned from top left */}
      <div className="w-full p-4 sm:p-6 md:p-8 flex justify-center h-[400px]">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
            🗂️ Add New Category
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              name="categoryName"
              label="Category Name"
              value={categoryData.categoryName}
              onChange={handleChange}
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-black text-white py-3 px-8 rounded-lg hover:bg-gray-800 transition-all duration-200"
              >
                Add Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Reusable Input Component
const Input = ({ name, type = 'text', label, value, onChange, required = false }) => (
  <div className="w-full">
    <label htmlFor={name} className="block text-gray-700 font-semibold mb-2">{label}</label>
    <input
      name={name}
      id={name}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
      required={required}
    />
  </div>
);

export default AddCategory;
