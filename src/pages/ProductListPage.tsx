import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts, useSearchProducts } from '../hooks/useProducts';
import ProductGrid from '../components/ProductGrid';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductListPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const limit = 20;
  
  // Use search or regular products based on query
  const { data: searchData, isLoading: isSearchLoading, error: searchError } = useSearchProducts(
    searchQuery, 
    currentPage, 
    limit
  );
  const { data: productsData, isLoading: isProductsLoading, error: productsError } = useProducts(
    currentPage, 
    limit
  );

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Determine which data to use
  const data = searchQuery ? 
    (searchData ? {
      products: searchData.products,
      total: searchData.total,
      hasMore: searchData.page * searchData.limit < searchData.total
    } : null) : 
    productsData;
  const isLoading = searchQuery ? isSearchLoading : isProductsLoading;
  const error = searchQuery ? searchError : productsError;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load products. Please try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
          </h1>
          {data && (
            <p className="text-gray-600">
              {searchQuery 
                ? `Found ${data.total || 0} products matching "${searchQuery}"`
                : `Showing ${data.products.length} of ${data.total || data.products.length} products`
              }
            </p>
          )}
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <ProductGrid products={data?.products || []} />
            
            {data && (data.total || 0) > limit && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil((data.total || 0) / limit)}
                onPageChange={handlePageChange}
                hasMore={data.hasMore || false}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;