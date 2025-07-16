import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu } from 'lucide-react';
import SearchModal from './SearchModal';

const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-gray-900">
                V-SVAG Store
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-gray-900 transition-colors">
                Products
              </Link>
            </nav>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <ShoppingCart className="w-5 h-5" />
              </button>
              <button className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
};

export default Header;