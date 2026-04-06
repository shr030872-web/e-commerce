import { BrowserRouter, Routes, Route } from "react-router-dom";

import Products from "./pages/Products.js";
import Cart from "./pages/Cart.js";
import Login from "./pages/Login.js";
import Dashboard from "./pages/Dashboard.js";
import Orders from "./pages/Orders.js";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;