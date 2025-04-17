import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/pages/auth/Login';
import Home from './components/pages/home/Home';
import Product from './components/pages/product/Product';
import Register from './components/pages/auth/register';
import AboutUs from './components/pages/home/About';
import ContactUs from './components/pages/home/Contact';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Product />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
    </Routes>
  );
}

export default App;
