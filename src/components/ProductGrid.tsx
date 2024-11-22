import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import ImageGallery from './admin/ImageGallery';

interface Product {
  id: number;
  productNumber: string;
  category: string;
  price: number;
  images: string[];
}

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found in this category.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group">
            <div 
              className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4 cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <img
                src={product.images[0]}
                alt={`Product ${product.productNumber}`}
                className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
              />
              {product.images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
                  +{product.images.length - 1}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm text-gray-700">Product #{product.productNumber}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">${product.price.toFixed(2)}</p>
              </div>
              <button 
                className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add to cart functionality would go here
                }}
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <ImageGallery
          images={selectedProduct.images}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
};

export default ProductGrid;