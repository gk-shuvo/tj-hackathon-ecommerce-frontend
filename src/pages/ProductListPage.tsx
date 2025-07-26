import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts, useSearchProducts } from '../hooks/useProducts';
import { Product } from '../types/product';
import ProductGrid from '../components/ProductGrid';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

type SortOption = {
  value: string;
  label: string;
  sortFn: (a: Product, b: Product) => number;
};

const sortOptions: SortOption[] = [
  {
    value: 'name-asc',
    label: 'Name (A-Z)',
    sortFn: (a, b) => a.name.localeCompare(b.name)
  },
  {
    value: 'name-desc',
    label: 'Name (Z-A)',
    sortFn: (a, b) => b.name.localeCompare(a.name)
  },
  {
    value: 'price-asc',
    label: 'Price (Low to High)',
    sortFn: (a, b) => a.price - b.price
  },
  {
    value: 'price-desc',
    label: 'Price (High to Low)',
    sortFn: (a, b) => b.price - a.price
  },
  {
    value: 'brand-asc',
    label: 'Brand (A-Z)',
    sortFn: (a, b) => (a.brand || '').localeCompare(b.brand || '')
  },
  {
    value: 'stock-desc',
    label: 'Stock (High to Low)',
    sortFn: (a, b) => (b.stock || 0) - (a.stock || 0)
  }
];

const ProductListPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name-asc');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const limit = 50;
  
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

  // Reset page when sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

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

  // Sort products based on selected option
  const sortedProducts = useMemo(() => {
    if (!data?.products) return [];
    
    const selectedSort = sortOptions.find(option => option.value === sortBy);
    if (!selectedSort) return data.products;
    
    return [...data.products].sort(selectedSort.sortFn);
  }, [data?.products, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
            </h1>
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={handleSortChange}
                className="px-3 py-2 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:border-gray-400 transition-colors duration-200"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
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
            <ProductGrid products={sortedProducts} />
            
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