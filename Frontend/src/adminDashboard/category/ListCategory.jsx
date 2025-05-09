import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCategory, listAllCategory, updateCategory } from '../../components/store/categorySlice';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const ListCategory = () => {
  const dispatch = useDispatch();
  const { category } = useSelector((state) => state.category);

  const [editMode, setEditMode] = useState(null); // currently editing category id
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    dispatch(listAllCategory());
  }, [dispatch]);


  

  const handleDelete = (id) => {
    if (id) {
      dispatch(deleteCategory(id));
      toast.success("Category deleted");
    } else {
      toast.error("Category not deleted");
    }
  };

  const handleEditClick = (item) => {
    setEditMode(item.id);
    setEditedName(item.categoryName);
  };

  const handleUpdate = async (id) => {
    if (editedName.trim() === '') {
      toast.error("Category name cannot be empty");
      return;
    }
  
    try {
      await dispatch(updateCategory({ id, categoryData: { categoryName: editedName } }));
      toast.success("Category updated");
      setEditMode(null); // Exit edit mode
      dispatch(listAllCategory()); // Refresh category list
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update category");
    }
  };
  

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />

      <div className="w-full md:flex-1 p-4 sm:p-6 md:p-8">
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">All Category</h2>
          <div className="space-y-4">
            {category && category.length > 0 ? (
              category.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition flex items-center justify-between px-4 py-2 h-16"
                >
                  {editMode === item.id ? (
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-3 w-full">
                      <input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="border rounded px-3 py-1 text-sm w-full md:w-auto"
                        autoFocus
                      />
                      <div className="flex items-center space-x-2 mt-2 md:mt-0">
                        <button
                          onClick={() => handleUpdate(item.id)}
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
                      <h3 className="text-sm font-medium text-gray-800 truncate">{item.categoryName}</h3>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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

export default ListCategory;
