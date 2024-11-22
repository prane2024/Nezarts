import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AllProductsPage from './pages/AllProductsPage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/all" element={<AllProductsPage />} />
          <Route path="/products/:category" element={<ProductsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;