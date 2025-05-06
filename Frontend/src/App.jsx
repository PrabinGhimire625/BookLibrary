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


function App() {
  return (
    <Provider store={store}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <div className="pt-16"> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/products" element={<Product />} />
          <Route path="/singleBook/:id" element={<SingleBook />} />

          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />

          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/addBook" element={<AddBook />} />
          <Route path="/listBook" element={<ListAllBook />} />
          <Route path="/editBook/:id" element={<EditBook />} />


          <Route path="/addCategory" element={<AddCategory />} />
          <Route path="/listCategory" element={<ListCategory />} />

          <Route path="/addGenre" element={<AddGenre />} />
          <Route path="/listGenre" element={<ListGenre />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />


          <Route path="/myOrder" element={<MyOrder />} />
          <Route path="/orderDetails/:id" element={<OrderDetails />} />

        </Routes>
      </div>
    </Provider>
  );
}

export default App;
