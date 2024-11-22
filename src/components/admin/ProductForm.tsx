import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import ImageUpload from './ImageUpload';
import { createProduct } from '../../services/productService';
import { generateProductNumber } from '../../utils/helpers';

interface ProductImage {
  file: File;
  preview: string;
}

interface ProductFormData {
  productNumber: string;
  category: string;
  price: number | '';
  images: ProductImage[];
}

const ProductForm = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    productNumber: generateProductNumber(),
    category: '',
    price: '',
    images: []
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    if (!formData.price) {
      setError('Please enter a price');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Convert all images to base64
      const base64Images = await Promise.all(
        formData.images.map(image => convertImageToBase64(image.file))
      );
      
      await createProduct({
        productNumber: formData.productNumber,
        category: formData.category,
        price: Number(formData.price),
        images: base64Images
      });

      toast.success('Product added successfully!');
      
      // Reset form
      setFormData({
        productNumber: generateProductNumber(),
        category: '',
        price: '',
        images: []
      });
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Number
            </label>
            <input
              type="text"
              value={formData.productNumber}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              required
            >
              <option value="">Select a category</option>
              <option value="necklace-set">Necklace Set</option>
              <option value="bangles">Bangles</option>
              <option value="earrings">Earrings</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price ($)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : '' })}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>
        </div>

        <div>
          <ImageUpload
            images={formData.images}
            onImagesChange={(images) => setFormData({ ...formData, images })}
            error={error}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Adding Product...' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;