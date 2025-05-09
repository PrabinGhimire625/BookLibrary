import { Link, useNavigate } from "react-router-dom";
import {
  FiBookOpen,
  FiPlusCircle,
  FiList,
  FiSettings,
  FiTag,
  FiGrid,
  FiBell,
  FiHome,
  FiUser,
  FiLogOut,
  FiUsers,
  FiShoppingCart
} from "react-icons/fi";
import { useDispatch } from "react-redux";
import { resetStatus } from "../../components/store/authSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(resetStatus());
    navigate("/login");
  };

  return (
    <div className="w-72 bg-white shadow-xl border-r border-gray-200 min-h-screen p-6 flex flex-col text-gray-800 text-base sm:w-64 md:w-72">
      {/* Admin Profile */}
      <div className="flex items-center space-x-4 mb-12">
        <Link to="/adminProfile">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuXKMwBGR8gRhpZlFDGIhWEbxiKs8sHUrpcg&s"
            alt="Admin"
            className="w-14 h-14 rounded-full object-cover shadow-md"
          />
        </Link>
        <div>
          <h3 className="text-lg font-semibold">Admin</h3>
          <p className="text-sm text-green-500 mt-1">Online</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2">

        <SidebarLink to="/dashboard" icon={<FiHome />} label="Dashboard" />
        <SidebarLink to="/userList" icon={<FiUsers />} label="User Management" />
        <SidebarLink to="/orderList" icon={<FiShoppingCart />} label="Order Management" />
        <SidebarLink to="/addBook" icon={<FiPlusCircle />} label="Add Book" />
        <SidebarLink to="/listBook" icon={<FiBookOpen />} label="All Books" />
        <SidebarLink to="/addCategory" icon={<FiPlusCircle />} label="Add Category" />
        <SidebarLink to="/listCategory" icon={<FiGrid />} label="List Category" />
        <SidebarLink to="/addGenre" icon={<FiPlusCircle />} label="Add Genre" />
        <SidebarLink to="/listGenre" icon={<FiTag />} label="List Genre" />
        <SidebarLink to="/addAnnouncement" icon={<FiPlusCircle />} label="Add Announcement" />
        <SidebarLink to="/listAnnouncement" icon={<FiBell />} label="List Announcement" />
        
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition duration-150 w-full mt-4"
        >
          <FiLogOut className="text-xl mr-3" />
          <span className="font-medium">Log out</span>
        </button>
      </nav>
    </div>
  );
};

const SidebarLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition duration-150"
  >
    <span className="text-xl mr-3">{icon}</span>
    <span className="font-medium">{label}</span>
  </Link>
);

export default Sidebar;
