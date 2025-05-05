import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addGenre, resetStatus } from '../../components/store/genreSlice';
import { STATUS } from '../../components/globals/status/status';
import Sidebar from '../sidebar/Sidebar';


const AddGenre = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.genre);

  const [genreData, setGenreData] = useState({
    genreName: '',
  });

  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGenreData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!genreData.genreName.trim()) {
      toast.error('Genre name is required!');
      return;
    }

    setIsLoading(true); // Set loading state when form is submitted
    dispatch(addGenre(genreData));
    if (status === STATUS.SUCCESS) {
        toast.success('Genre added successfully!');
        dispatch(resetStatus());
        setIsLoading(false); // Reset loading state
        navigate('/listGenre');
      } else if (status === STATUS.ERROR) {
        toast.error('Failed to add genre.');
        dispatch(resetStatus());
        setIsLoading(false); // Reset loading state
      }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area aligned from top left */}
      <div className="w-full p-4 sm:p-6 md:p-8 flex justify-center h-[400px]">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
            🗂️ Add New Genre
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              name="genreName"
              label="Genre Name"
              value={genreData.genreName}
              onChange={handleChange}
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading} // Disable the button during loading state
                className={`bg-black text-white py-3 px-8 rounded-lg hover:bg-gray-800 transition-all duration-200 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Adding...' : 'Add Genre'}
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

export default AddGenre;
