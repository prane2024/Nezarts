import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { updateProduct } from '../../services/productService';
import ImageUpload from './ImageUpload';

interface Product {
  id: number;
  productNumber: string;
  category: string;
  price: number;
  images: string[];
}

interface ProductImage {
  file: File;
  preview: string;
}

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onSave: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    category: product.category,
    price: product.price,
  });
  const [images, setImages] = useState<ProductImage[]>(
    product.images.map(url => ({ preview: url, file: new File([], '') }))
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Convert new images to base64
      const imageUrls = await Promise.all(
        images.map(async image => {
          if (image.file.size === 0) {
            return image.preview; // Keep existing image URL
          }
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(image.file);
          });
        })
      );

      await updateProduct(product.id, {
        ...formData,
        images: imageUrls,
      });

      toast.success('Product updated successfully!');
      onSave();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Edit Product #{product.productNumber}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  <option value="necklace-set">Necklace Set</option>
                  <option value="bangles">Bangles</option>
                  <option value="earrings">Earrings</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>

              <ImageUpload
                images={images}
                onImagesChange={setImages}
                error={error}
              />

              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;