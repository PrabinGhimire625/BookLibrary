import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listActiveAnnouncement } from '../../store/AnnouncementSlice';
import { FaBullhorn } from 'react-icons/fa';

const ActiveAnnouncement = () => {
  const dispatch = useDispatch();
  const { activeAnnouncement } = useSelector((state) => state.announcement);

  useEffect(() => {
    dispatch(listActiveAnnouncement());
  }, [dispatch]);

  const announcement = activeAnnouncement?.[0];

  return (
    <div className="w-full px-4 py-3 sm:px-6 lg:px-16">
      {announcement ? (
        <div className="bg-gradient-to-r from-[#1f2937] to-[#111827] text-white border border-blue-200 rounded-xl shadow-lg p-5 transition hover:shadow-md">
          <div className="flex items-start sm:items-center gap-4">
            <div className="text-2xl text-yellow-400 flex-shrink-0 animate-pulse">
              <FaBullhorn />
            </div>
            <div className="flex-1">
              <h2 className="text-md sm:text-lg font-semibold text-white mb-1 tracking-wide">
                📢 <span className="text-blue-300">{announcement.title}</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-snug">
                {announcement.message}
              </p>
              <div className="text-xs text-gray-400 mt-1">
                <span className="mr-2">🕒 <strong>Start:</strong> {new Date(announcement.startTime).toLocaleString()}</span>
                <span>⏳ <strong>End:</strong> {new Date(announcement.endTime).toLocaleString()}</span>
              </div>
            </div>
          </div>

         

          {/* Footer note */}
          <div className="text-right mt-2 text-[11px] text-gray-500">
            — Stay informed. Stay inspired.
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 text-gray-600 text-center p-4 rounded-lg shadow-sm">
          <p className="text-sm">📢 No active announcements at the moment. Please check back later!</p>
        </div>
      )}
    </div>
  );
};

export default ActiveAnnouncement;
