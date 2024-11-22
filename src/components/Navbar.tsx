import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MenuIcon, ShoppingCart, Search, X, Settings } from 'lucide-react';

interface NavbarProps {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  onCategorySelect: (category: string) => void;
  selectedCategory: string | null;
}

const Navbar = ({ isAdmin, setIsAdmin, onCategorySelect, selectedCategory }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCategoryClick = (category: string) => {
    onCategorySelect(category);
    navigate(`/products/${category}`);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleAdminClick = () => {
    const newAdminState = !isAdmin;
    setIsAdmin(newAdminState);
    
    // Only navigate to home if we're entering admin mode and not already on home page
    if (newAdminState && location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <h1 
              className="text-2xl font-serif font-bold text-purple-900 cursor-pointer hover:text-purple-700 transition-colors" 
              onClick={handleLogoClick}
            >
              Nezarts Bling
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleCategoryClick('necklace-set')}
              className={`text-gray-700 hover:text-purple-900 transition ${
                selectedCategory === 'necklace-set' ? 'text-purple-900 font-semibold' : ''
              }`}
            >
              Necklace Sets
            </button>
            <button 
              onClick={() => handleCategoryClick('bangles')}
              className={`text-gray-700 hover:text-purple-900 transition ${
                selectedCategory === 'bangles' ? 'text-purple-900 font-semibold' : ''
              }`}
            >
              Bangles
            </button>
            <button 
              onClick={() => handleCategoryClick('earrings')}
              className={`text-gray-700 hover:text-purple-900 transition ${
                selectedCategory === 'earrings' ? 'text-purple-900 font-semibold' : ''
              }`}
            >
              Earrings
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full relative">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              <span className="absolute top-0 right-0 bg-purple-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </button>
            <button 
              onClick={handleAdminClick}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition ${
                isAdmin ? 'bg-purple-100 text-purple-900' : 'hover:bg-gray-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button 
              onClick={handleAdminClick}
              className={`p-2 rounded-md transition ${
                isAdmin ? 'bg-purple-100 text-purple-900' : 'hover:bg-gray-100'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => {
                handleCategoryClick('necklace-set');
                setIsOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Necklace Sets
            </button>
            <button
              onClick={() => {
                handleCategoryClick('bangles');
                setIsOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Bangles
            </button>
            <button
              onClick={() => {
                handleCategoryClick('earrings');
                setIsOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Earrings
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;