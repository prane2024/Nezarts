import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';
import { getProductsByCategory } from '../services/productService';

const categoryTitles: { [key: string]: string } = {
  'necklace-set': 'Necklace Sets',
  'bangles': 'Bangles',
  'earrings': 'Earrings'
};

const ProductsPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      if (!category || !Object.keys(categoryTitles).includes(category)) {
        navigate('/');
        return;
      }

      setIsLoading(true);
      try {
        const categoryProducts = await getProductsByCategory(category);
        setProducts(categoryProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [category, navigate]);

  return (
    <>
      <Navbar 
        isAdmin={isAdmin} 
        setIsAdmin={setIsAdmin}
        onCategorySelect={(newCategory) => navigate(`/products/${newCategory}`)}
        selectedCategory={category || null}
      />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-gray-900">
              {categoryTitles[category || '']}
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Discover our exquisite collection of {categoryTitles[category || ''].toLowerCase()}
            </p>
          </div>

          <ProductGrid products={products} isLoading={isLoading} />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductsPage;