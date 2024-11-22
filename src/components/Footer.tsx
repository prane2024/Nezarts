import React from 'react';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Nezarts Bling</h3>
            <p className="text-gray-300">
              Crafting timeless pieces that celebrate your unique style and beauty.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Collections</h4>
            <ul className="space-y-2">
              <li><a href="#necklaces" className="text-gray-300 hover:text-white">Necklace Sets</a></li>
              <li><a href="#bangles" className="text-gray-300 hover:text-white">Bangles</a></li>
              <li><a href="#earrings" className="text-gray-300 hover:text-white">Earrings</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Shipping Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Returns & Exchanges</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Size Guide</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-purple-200">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-purple-200">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-purple-200">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-purple-800 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Nezarts Bling. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;