import { Routes, Route } from 'react-router-dom';
import Login from './components/pages/auth/Login';
import Home from './components/pages/home/Home';
import Product from './components/pages/product/Product';
import Register from './components/pages/auth/Register';
import AboutUs from './components/pages/home/About';
import ContactUs from './components/pages/home/Contact';
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


function App() {
  return (
    <Provider store={store}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <div className="pt-16">
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
          <Route path="/addBook" element={<ProtectedRoute element={AddBook} allowedRoles={['Admin']} />} />
          <Route path="/listBook" element={<ProtectedRoute element={ListAllBook} allowedRoles={['Admin']} />} />
          <Route path="/editBook/:id" element={<ProtectedRoute element={EditBook} allowedRoles={['Admin']} />} />
          <Route path="/addCategory" element={<ProtectedRoute element={AddCategory} allowedRoles={['Admin']} />} />
          <Route path="/listCategory" element={<ProtectedRoute element={ListCategory} allowedRoles={['Admin']} />} />
          <Route path="/addGenre" element={<ProtectedRoute element={AddGenre} allowedRoles={['Admin']} />} />
          <Route path="/listGenre" element={<ProtectedRoute element={ListGenre} allowedRoles={['Admin']} />} />

          {/* Staff Routes */}
          <Route path="/staffDashboard" element={<ProtectedRoute element={StaffDashboard} allowedRoles={['Staff']} />} />

          {/* Shared Components */}
          <Route path="/sidebar" element={<ProtectedRoute element={Sidebar} allowedRoles={['Admin', 'Staff']} />} />

        </Routes>

      </div>
    </Provider>
  );
}

export default App;
