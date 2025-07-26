import React, { useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Download } from 'lucide-react';

// Lazy load SearchModal
const SearchModal = lazy(() => import('./SearchModal'));

const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch('/api/statistics/download', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'statistics-report.csv';
      
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-300 sticky top-0 z-40">
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
              <button
                onClick={handleDownloadReport}
                disabled={isDownloading}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? 'Downloading...' : 'Download Report'}
              </button>
            </nav>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>
              <button 
                className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/products" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Products
              </Link>
              <button
                onClick={() => {
                  handleDownloadReport();
                  setIsMobileMenuOpen(false);
                }}
                disabled={isDownloading}
                className="flex items-center gap-2 w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? 'Downloading...' : 'Download Report'}
              </button>
            </div>
          </div>
        )}
      </header>
      
      {isSearchOpen && (
        <Suspense fallback={<div>Loading...</div>}>
          <SearchModal 
            isOpen={isSearchOpen} 
            onClose={() => setIsSearchOpen(false)} 
          />
        </Suspense>
      )}
    </>
  );
};

export default Header;