import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Sidebar from '../sidebar/Sidebar';
import { deleteGenre, listAllGenre, updateGenre } from '../../components/store/genreSlice';

const ListGenre = () => {
  const dispatch = useDispatch();
  const { genre } = useSelector((state) => state.genre);

  const [editMode, setEditMode] = useState(null); // currently editing genre id
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    dispatch(listAllGenre());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (id) {
      dispatch(deleteGenre(id));  // This will trigger the action to remove the genre from the Redux state
      toast.success("Genre deleted");
    } else {
      toast.error("Genre not deleted");
    }
  };
  
  
  const handleEditClick = (item) => {
    setEditMode(item.genreId); // changed to genreId
    setEditedName(item.genreName); // changed to genreName
  };

  const handleUpdate = async (id) => {
    if (editedName.trim() === '') {
      toast.error("Genre name cannot be empty");
      return;
    }
  
    try {
      await dispatch(updateGenre({ id, genreData: { genreName: editedName } }));
      toast.success("Genre updated");
      setEditMode(null); // Exit edit mode
      dispatch(listAllGenre()); // Refresh genre list
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update genre");
    }
  };
  
  console.log("genre", genre);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />

      <div className="w-full md:flex-1 p-4 sm:p-6 md:p-8">
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
          <div className="space-y-4">
            {genre && genre.length > 0 ? (
              genre.map((item) => (
                <div
                  key={item.genreId} // changed to genreId for uniqueness
                  className="bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition flex items-center justify-between px-4 py-2 h-16"
                >
                  {editMode === item.genreId ? ( // changed to genreId
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-3 w-full">
                      <input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="border rounded px-3 py-1 text-sm w-full md:w-auto"
                        autoFocus
                      />
                      <div className="flex items-center space-x-2 mt-2 md:mt-0">
                        <button
                          onClick={() => handleUpdate(item.genreId)} // changed to genreId
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
                    <>
                      <h3 className="text-sm font-medium text-gray-800 truncate">{item.genreName}</h3> {/* changed to genreName */}

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.genreId)} // changed to genreId
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No categories available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListGenre;
