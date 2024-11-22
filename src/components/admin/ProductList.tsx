import React, { useState, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { getAllProducts, deleteProduct } from '../../services/productService';
import { toast } from 'react-hot-toast';
import EditProductModal from './EditProductModal';

interface Product {
  id: number;
  productNumber: string;
  category: string;
  price: number;
  images: string[];
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadProducts = async () => {
    try {
      const allProducts = await getAllProducts();
      setProducts(allProducts);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        await loadProducts();
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-square relative group">
              <img
                src={product.images[0]}
                alt={`Product ${product.productNumber}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="p-2 bg-white rounded-full text-purple-600 hover:text-purple-700"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 bg-white rounded-full text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {product.images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
                  +{product.images.length - 1}
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">#{product.productNumber}</h3>
                  <p className="text-sm text-gray-500 capitalize">{product.category.replace('-', ' ')}</p>
                </div>
                <p className="text-lg font-semibold text-purple-600">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={async () => {
            await loadProducts();
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductList;