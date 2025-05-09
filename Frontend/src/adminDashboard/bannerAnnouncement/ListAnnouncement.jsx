import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { deleteAnnouncement, listAllAnnouncement, updateAnnouncement } from '../../components/store/AnnouncementSlice';
import Sidebar from '../sidebar/Sidebar';

const ListAnnouncement = () => {
  const dispatch = useDispatch();
  const { announcement } = useSelector((state) => state.announcement);

  const [editMode, setEditMode] = useState(null);
  const [editedData, setEditedData] = useState({
    title: '',
    message: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    dispatch(listAllAnnouncement());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (id) {
      dispatch(deleteAnnouncement(id));
      toast.success("Announcement deleted");
    } else {
      toast.error("Failed to delete announcement");
    }
  };

  const handleEditClick = (item) => {
    setEditMode(item.bannerAnnouncementId);
    setEditedData({
      title: item.title,
      message: item.message,
      startTime: item.startTime,
      endTime: item.endTime
    });
  };

  const handleUpdate = async (id) => {
    const { title, message, startTime, endTime } = editedData;

    if (!title.trim() || !message.trim()) {
      toast.error("Title and message cannot be empty");
      return;
    }

    try {
      await dispatch(updateAnnouncement({ id, announcementData: editedData }));
      toast.success("Announcement updated");
      setEditMode(null);
      dispatch(listAllAnnouncement());
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update announcement");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  console.log("Announcement ")

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <div className="w-full md:flex-1 p-4 sm:p-6 md:p-8">
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">All Announcement</h2>
          <div className="space-y-4">
            {announcement && announcement.length > 0 ? (
              announcement.map((item) => (
                <div
                  key={item.bannerAnnouncementId}
                  className="bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition px-4 py-4"
                >
                  {editMode === item.bannerAnnouncementId ? (
                    <div className="flex flex-col space-y-2">
                      <input
                        type="text"
                        name="title"
                        value={editedData.title}
                        onChange={handleChange}
                        className="border rounded px-3 py-2 text-sm"
                        placeholder="Title"
                      />
                      <input
                        type="text"
                        name="message"
                        value={editedData.message}
                        onChange={handleChange}
                        className="border rounded px-3 py-2 text-sm"
                        placeholder="Message"
                      />
                      <input
                        type="datetime-local"
                        name="startTime"
                        value={editedData.startTime}
                        onChange={handleChange}
                        className="border rounded px-3 py-2 text-sm"
                      />
                      <input
                        type="datetime-local"
                        name="endTime"
                        value={editedData.endTime}
                        onChange={handleChange}
                        className="border rounded px-3 py-2 text-sm"
                      />

                      <div className="flex space-x-3 pt-2">
                        <button
                          onClick={() => handleUpdate(item.bannerAnnouncementId)}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditMode(null)}
                          className="text-gray-600 hover:text-gray-800 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.message}</p>
                        <p className="text-gray-500 text-xs">
                          {new Date(item.startTime).toLocaleString()} - {new Date(item.endTime).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex space-x-2 mt-2 sm:mt-0">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.bannerAnnouncementId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No announcements available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListAnnouncement;
