import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductsByCategory } from '../services/productService';
import ProductGrid from './ProductGrid';

interface CategoryData {
  id: string;
  title: string;
  description: string;
  image: string;
}

const defaultCategories: CategoryData[] = [
  {
    id: 'necklace-set',
    title: 'Necklace Sets',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80',
    description: 'Elegant necklace sets for every occasion'
  },
  {
    id: 'bangles',
    title: 'Bangles',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80',
    description: 'Traditional to contemporary bangles'
  },
  {
    id: 'earrings',
    title: 'Earrings',
    image: 'https://images.unsplash.com/photo-1635767798638-3665c302e27c?auto=format&fit=crop&q=80',
    description: 'Statement earrings that define your style'
  }
];

interface CategoriesProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ selectedCategory, onCategorySelect }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryData[]>(defaultCategories);

  useEffect(() => {
    const loadCategoryImages = async () => {
      const updatedCategories = await Promise.all(
        defaultCategories.map(async (category) => {
          try {
            const categoryProducts = await getProductsByCategory(category.id);
            // Find the first product with images in this category
            const productWithImage = categoryProducts.find(p => p.images && p.images.length > 0);
            return {
              ...category,
              // Use uploaded image if available, otherwise keep default
              image: productWithImage ? productWithImage.images[0] : category.image
            };
          } catch (error) {
            console.error(`Failed to load images for category ${category.id}:`, error);
            return category;
          }
        })
      );
      setCategories(updatedCategories);
    };

    loadCategoryImages();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      if (selectedCategory) {
        setIsLoading(true);
        try {
          const categoryProducts = await getProductsByCategory(selectedCategory);
          setProducts(categoryProducts);
        } catch (error) {
          console.error('Error loading products:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadProducts();
  }, [selectedCategory]);

  const handleViewCollection = (categoryId: string) => {
    navigate(`/products/${categoryId}`);
  };

  return (
    <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-serif font-bold text-gray-900 text-center mb-12">
        Our Collections
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer ${
              selectedCategory === category.id ? 'ring-2 ring-purple-500' : ''
            }`}
            onClick={() => onCategorySelect(category.id)}
          >
            <div className="aspect-w-3 aspect-h-4">
              <img
                src={category.image}
                alt={category.title}
                className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-serif font-bold mb-2">{category.title}</h3>
              <p className="text-gray-200 mb-4">{category.description}</p>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewCollection(category.id);
                }}
                className="bg-white text-purple-900 px-4 py-2 rounded-md hover:bg-purple-50 transition"
              >
                View Collection
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCategory && (
        <div>
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8">
            {categories.find(c => c.id === selectedCategory)?.title}
          </h3>
          <ProductGrid products={products} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
};

export default Categories;