import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSearchProducts } from '../hooks/useProducts';
import LazyImage from './LazyImage';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { data, isLoading, error } = useSearchProducts(debouncedQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleProductClick = () => {
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-16">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Search Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 outline-none text-lg"
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {query.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Start typing to search products...</p>
            </div>
          ) : isLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Searching...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              <p>Error searching products. Please try again.</p>
            </div>
          ) : data && data.products.length > 0 ? (
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                Found {data.total} results for "{query}"
              </p>
              <div className="space-y-3">
                {data.products.slice(0, 8).map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={handleProductClick}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <LazyImage
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 rounded-md flex-shrink-0"
                      width={48}
                      height={48}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600">${product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
              {data.total > 8 && (
                <Link
                  to={`/products?search=${encodeURIComponent(query)}`}
                  onClick={handleProductClick}
                  className="block mt-4 p-3 text-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  View all {data.total} results
                </Link>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No products found for "{query}"</p>
              <p className="text-sm mt-2">Try different keywords</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;