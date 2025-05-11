import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addTimeDiscount } from '../../components/store/bookSlice';
import { toast } from 'react-toastify';
import Sidebar from '../sidebar/Sidebar';

const TimeDiscount = () => {
  const { bookId } = useParams(); // Get the book ID from the URL
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [discountData, setDiscountData] = useState({
    discountPercentage: '',
    discountStartDate: '',
    discountEndDate: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDiscountData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDiscountSubmit = (e) => {
    e.preventDefault();

    if (!discountData.discountPercentage || !discountData.discountStartDate || !discountData.discountEndDate) {
      toast.error('All fields are required!');
      return;
    }

    setIsLoading(true);
    dispatch(addTimeDiscount(bookId, discountData));
    setIsLoading(false);
    toast.success('Discount added successfully!');
    navigate('/'); // Redirect to the book list or previous page
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <div className="w-full p-4 sm:p-6 md:p-8 flex justify-center h-[400px]">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
            ⏳ Set Time Discount
          </h2>
          <form onSubmit={handleDiscountSubmit} className="space-y-6">
            <Input
              name="discountPercentage"
              label="Discount Percentage"
              value={discountData.discountPercentage}
              onChange={handleChange}
              type="number"
              required
            />
            <Input
              name="discountStartDate"
              label="Start Date (UTC)"
              value={discountData.discountStartDate}
              onChange={handleChange}
              type="datetime-local"
              required
            />
            <Input
              name="discountEndDate"
              label="End Date (UTC)"
              value={discountData.discountEndDate}
              onChange={handleChange}
              type="datetime-local"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`bg-black text-white py-3 px-8 rounded-lg hover:bg-gray-800 transition-all duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {isLoading ? 'Adding...' : 'Add Discount'}
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
    <label htmlFor={name} className="block text-gray-700 font-semibold mb-2">
      {label}
    </label>
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

export default TimeDiscount;
