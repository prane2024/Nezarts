import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Layers, FileText, Plus } from 'lucide-react';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import LogViewer from './LogViewer';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'logs'>('products');
  const [showProductForm, setShowProductForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Layers className="w-5 h-5" />
                  <span>Products</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'logs'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>System Logs</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'products' ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-serif font-bold text-gray-900">
                    Product Management
                  </h1>
                  <button
                    onClick={() => setShowProductForm(!showProductForm)}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{showProductForm ? 'View Products' : 'Add Product'}</span>
                  </button>
                </div>
                {showProductForm ? <ProductForm /> : <ProductList />}
              </>
            ) : (
              <>
                <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                  System Logs
                </h1>
                <LogViewer />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;