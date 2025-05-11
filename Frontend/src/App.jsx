import { Routes, Route } from 'react-router-dom';
import Login from './components/pages/auth/Login';
import Home from './components/pages/home/Home';
import Product from './components/pages/product/Product';
import Register from './components/pages/auth/Register';

import { Provider } from 'react-redux';
import store from "./components/store/store";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './adminDashboard/dashboard/Dashboard';
import AddBook from './adminDashboard/Book/AddBook';
import ListAllBook from './adminDashboard/Book/ListAllBook';
import Sidebar from './adminDashboard/sidebar/Sidebar';
import Profile from './components/pages/auth/Profile';
import Navbar from './components/globals/Navbar';
import AddCategory from './adminDashboard/category/AddCategory';
import ListCategory from './adminDashboard/category/ListCategory';
import EditBook from './adminDashboard/Book/EditBook';
import AddGenre from './adminDashboard/genre/AddGenre';
import ListGenre from './adminDashboard/genre/ListGenre';
import SingleProduct from './components/pages/product/SingleBook';
import SingleBook from './components/pages/product/SingleBook';
import Cart from './components/pages/cart/Cart';
import Checkout from './components/pages/checkout/Checkout';
import MyOrders from './components/pages/order/MyOrder';
import MyOrder from './components/pages/order/MyOrder';
import OrderDetails from './components/pages/order/OrderDetails';
import WhiteList from './components/pages/whiteList/WhiteList';
import Review from './components/pages/order/Review';
import StaffDashboard from './staffDashboard/StaffDashboard';
import ProtectedRoute from './components/routes/ProtectedRoute';
import AboutUs from './components/pages/about/About';
import ContactUs from './components/pages/contact/Contact';
import Footer from './components/globals/Footer';
import AddAnnouncement from './adminDashboard/bannerAnnouncement/AddAnnouncement';
import ListAnnouncement from './adminDashboard/bannerAnnouncement/ListAnnouncement';
import AdminProfile from './adminDashboard/profile/AdminProfile';
import UserList from './adminDashboard/List/UserList';
import OrderList from './adminDashboard/List/OrderList';
import Search from './components/pages/search/Search';
import TimeDiscount from './adminDashboard/Book/TimeDiscount';

function App() {
  return (
    <Provider store={store}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Product />} />
          <Route path="/singleBook/:id" element={<SingleBook />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Member Routes */}
          <Route path="/profile" element={<ProtectedRoute element={Profile} allowedRoles={['Member', 'Admin', 'Staff']} />} />
          <Route path="/cart" element={<ProtectedRoute element={Cart} allowedRoles={['Member']} />} />
          <Route path="/checkout" element={<ProtectedRoute element={Checkout} allowedRoles={['Member']} />} />
          <Route path="/myOrder" element={<ProtectedRoute element={MyOrder} allowedRoles={['Member']} />} />
          <Route path="/orderDetails/:id" element={<ProtectedRoute element={OrderDetails} allowedRoles={['Member']} />} />
          <Route path="/review/:bookId" element={<ProtectedRoute element={Review} allowedRoles={['Member']} />} />
          <Route path="/whiteList" element={<ProtectedRoute element={WhiteList} allowedRoles={['Member']} />} />

          {/* Admin Routes */}
          <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} allowedRoles={['Admin']} />} />
          <Route path="/adminProfile" element={<ProtectedRoute element={AdminProfile} allowedRoles={['Admin']} />} />
          <Route path="/addBook" element={<ProtectedRoute element={AddBook} allowedRoles={['Admin']} />} />
          <Route path="/listBook" element={<ProtectedRoute element={ListAllBook} allowedRoles={['Admin']} />} />
          <Route path="/editBook/:id" element={<ProtectedRoute element={EditBook} allowedRoles={['Admin']} />} />
          <Route path="/addCategory" element={<ProtectedRoute element={AddCategory} allowedRoles={['Admin']} />} />
          <Route path="/listCategory" element={<ProtectedRoute element={ListCategory} allowedRoles={['Admin']} />} />
          <Route path="/addGenre" element={<ProtectedRoute element={AddGenre} allowedRoles={['Admin']} />} />
          <Route path="/listGenre" element={<ProtectedRoute element={ListGenre} allowedRoles={['Admin']} />} />
          <Route path="/addAnnouncement" element={<ProtectedRoute element={AddAnnouncement} allowedRoles={['Admin']} />} />
          <Route path="/listAnnouncement" element={<ProtectedRoute element={ListAnnouncement} allowedRoles={['Admin']} />} />
          <Route path="/userList" element={<ProtectedRoute element={UserList} allowedRoles={['Admin']} />} />
          <Route path="/orderList" element={<ProtectedRoute element={OrderList} allowedRoles={['Admin', 'Staff']} />} />
          <Route path="/timeDiscount/:bookId" element={<ProtectedRoute element={TimeDiscount} allowedRoles={['Admin']} />} />

          {/* Staff Routes */}
          <Route path="/staffDashboard" element={<ProtectedRoute element={StaffDashboard} allowedRoles={['Staff', 'Admin']} />} />

          {/* Shared Components */}
          <Route path="/sidebar" element={<ProtectedRoute element={Sidebar} allowedRoles={['Admin']} />} />
          <Route path="/search" element={<ProtectedRoute element={Search} allowedRoles={['Admin', 'Member', 'Staff']} />} />

        </Routes>
      {/* <Footer/> */}
    </Provider>
  );
}

export default App;
