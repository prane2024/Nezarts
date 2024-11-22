import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../services/productService';

const Hero = () => {
  const navigate = useNavigate();
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedImage = async () => {
      try {
        const products = await getAllProducts();
        // Find a necklace set image first, as they usually make good hero images
        const necklaceSet = products.find(p => p.category === 'necklace-set' && p.images.length > 0);
        if (necklaceSet) {
          setHeroImage(necklaceSet.images[0]);
          return;
        }
        // Fallback to any product image
        const productWithImage = products.find(p => p.images.length > 0);
        if (productWithImage) {
          setHeroImage(productWithImage.images[0]);
        }
      } catch (error) {
        console.error('Failed to load hero image:', error);
      }
    };

    loadFeaturedImage();
  }, []);

  const handleExploreClick = () => {
    navigate('/products/all');
  };

  return (
    <div className="relative pt-16">
      <div className="absolute inset-0">
        <img
          className="w-full h-[600px] object-cover"
          src={heroImage || "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?auto=format&fit=crop&q=80"}
          alt="Luxury jewelry background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 mix-blend-multiply" />
      </div>
      
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl font-serif">
          Timeless Elegance
        </h1>
        <p className="mt-6 max-w-xl text-xl text-gray-300">
          Discover our exquisite collection of handcrafted jewelry, where each piece tells a unique story of beauty and sophistication.
        </p>
        <div className="mt-10">
          <button 
            onClick={handleExploreClick}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-purple-900 bg-white hover:bg-gray-50 transition"
          >
            Explore Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;