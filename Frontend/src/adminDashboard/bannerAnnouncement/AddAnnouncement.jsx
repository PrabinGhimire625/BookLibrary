import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addAnnouncement, resetStatus } from '../../components/store/AnnouncementSlice';
import { STATUS } from '../../components/globals/status/status';
import Sidebar from '../sidebar/Sidebar';

const AddAnnouncement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector(state => state.announcement);

  const [announcementData, setAnnouncementData] = useState({
    title: '',
    message: '',
    startTime: '',
    endTime: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnnouncementData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { title, message, startTime, endTime } = announcementData;

    if (!title || !message || !startTime || !endTime) {
      toast.error('All fields are required!');
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      toast.error('End time must be after start time.');
      return;
    }

    const payload = {
      ...announcementData,
      startTime: new Date(start).toISOString(),
      endTime: new Date(end).toISOString()
    };

    dispatch(addAnnouncement(payload));
    if (status === STATUS.SUCCESS) {
      toast.success("Announcement created successfully!");
      dispatch(resetStatus());
      navigate('/listAnnouncement');
    } else if (status === STATUS.ERROR) {
      toast.error("Failed to add announcement.");
      dispatch(resetStatus());
    }
  };


  const minDate = new Date().toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM

  return (
   <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
  <Sidebar />
  <div className="w-full p-4 sm:p-6 md:p-8 flex justify-center ">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-6 sm:p-8 h-[600px]">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
            🗂️ Add New Announcement
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              name="title"
              label="Announcement Title"
              value={announcementData.title}
              onChange={handleChange}
              required
            />
            <Input
              name="message"
              label="Announcement Message"
              value={announcementData.message}
              onChange={handleChange}
              required
            />
            <Input
              name="startTime"
              label="Start Time"
              type="datetime-local"
              value={announcementData.startTime}
              onChange={handleChange}
              min={minDate}
              required
            />
            <Input
              name="endTime"
              label="End Time"
              type="datetime-local"
              value={announcementData.endTime}
              onChange={handleChange}
              min={minDate}
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-black text-white py-3 px-8 rounded-lg hover:bg-gray-800 transition-all duration-200"
              >
                Add Announcement
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Input = ({ name, type = 'text', label, value, onChange, required = false, min }) => (
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
      min={min}
      className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
      required={required}
    />
  </div>
);

export default AddAnnouncement;
