import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import { Pencil, Trash2 } from 'lucide-react'; 
import { toast } from 'react-toastify';
import { ListAllUser } from '../../components/store/authSlice';

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, userList, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(ListAllUser());
  }, [dispatch]);

  // Display loading or error messages
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="loader">Loading users...</div>
      </div>
    );
  }

  if (error) {
    toast.error(error);
    return <div className="text-center">Something went wrong!</div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <div className="w-full p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">User List</h2>
        <div className="bg-white p-6 rounded-lg shadow-xl overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Address</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userList?.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 cursor-pointer transition duration-200 ease-in-out"
                >
                  <td className="py-3 px-4 flex items-center space-x-3">
                    <span>{user.name}</span>
                  </td>
                  <td className="py-3 px-4">{user.address || 'N/A'}</td>
                  <td className="py-3 px-4">{user.phone}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4 flex space-x-2">
                    <button
                      onClick={() => navigate(`/editUser/${user.id}`)} 
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
