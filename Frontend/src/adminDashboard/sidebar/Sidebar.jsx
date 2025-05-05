import { Link } from "react-router-dom";
import { FaBook, FaPlus, FaList, FaCog } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-72 bg-gray-800 text-gray-300 min-h-screen p-5 flex flex-col text-lg">
      {/* Admin Profile */}
      <div className="flex items-center space-x-4 mb-10 mt-2">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuXKMwBGR8gRhpZlFDGIhWEbxiKs8sHUrpcg&s" // Replace with actual asset if needed
          alt="Admin"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="text-xl font-semibold">Admin</h3>
          <p className="text-sm text-green-400 mt-1">Online</p>
        </div>
      </div>

      {/* Book Management Menu */}
      <nav className="flex-1">
        <Link to="/dashboard" className="flex items-center p-3 rounded-lg hover:bg-gray-700">
          <FaBook className="mr-3" /> Dashboard
        </Link>
        <Link to="/addBook" className="flex items-center p-3 rounded-lg hover:bg-gray-700">
          <FaPlus className="mr-3" /> Add Book
        </Link>
        <Link to="/listBook" className="flex items-center p-3 rounded-lg hover:bg-gray-700">
          <FaList className="mr-3" /> All Books
        </Link>
       
        <Link to="/addCategory" className="flex items-center p-3 rounded-lg hover:bg-gray-700">
          <FaPlus className="mr-3" /> Add Categories
        </Link>
        <Link to="/listCategory" className="flex items-center p-3 rounded-lg hover:bg-gray-700">
          <FaList className="mr-3" /> List category
        </Link>
        <Link to="/addGenre" className="flex items-center p-3 rounded-lg hover:bg-gray-700">
          <FaPlus className="mr-3" /> Add Genre
        </Link>
        <Link to="/listGenre" className="flex items-center p-3 rounded-lg hover:bg-gray-700">
          <FaList className="mr-3" /> List Genre
        </Link>
       

        <Link to="/settings" className="flex items-center p-3 rounded-lg hover:bg-gray-700">
          <FaCog className="mr-3" /> Settings
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
