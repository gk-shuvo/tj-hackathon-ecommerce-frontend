import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLatestProducts } from '../hooks/useProducts';
import ImageSlider from '../components/ImageSlider';
import ProductGrid from '../components/ProductGrid';


// Skeleton component for products
const ProductsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-300 animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
        <div className="p-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const HomePage: React.FC = () => {
  const { data: latestProducts, isLoading, error } = useLatestProducts(10);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Load immediately */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ImageSlider />
      </section>

      {/* Latest Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Latest Products</h2>
          <Link
            to="/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Products
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {error ? (
          <div className="text-center py-8">
            <p className="text-red-600">Failed to load products. Please try again.</p>
          </div>
        ) : isLoading ? (
          <ProductsSkeleton />
        ) : (
          <ProductGrid products={latestProducts || []} />
        )}
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose V-SVAG Store?</h2>
            <p className="text-lg text-gray-600">Quality products, great prices, fast delivery</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your orders delivered quickly and securely</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
              <p className="text-gray-600">Carefully curated selection of premium items</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Great Prices</h3>
              <p className="text-gray-600">Competitive prices on all our products</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;