import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';
import { getAllProducts } from '../services/productService';

const AllProductsPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <>
      <Navbar 
        isAdmin={isAdmin} 
        setIsAdmin={setIsAdmin}
        onCategorySelect={() => {}}
        selectedCategory={null}
      />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-gray-900">
              Our Complete Collection
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Browse through our entire collection of exquisite jewelry pieces
            </p>
          </div>

          <ProductGrid products={products} isLoading={isLoading} />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AllProductsPage;