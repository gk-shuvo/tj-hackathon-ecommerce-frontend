import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart } from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import LazyImage from '../components/LazyImage';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(id!);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Product not found</p>
          <Link 
            to="/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-4">
            <Link 
              to="/products"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Products
            </Link>
          </div>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link 
            to="/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Products
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-500 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="aspect-square">
              <LazyImage
                src={product.image_url}
                alt={product.name}
                className="w-full h-full rounded-lg"
                // width={600}
                // height={600}
                loading="eager"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product?.rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                <div className="text-3xl font-bold text-gray-900 mb-6">
                  ${product.price}
                </div>

                <div className="prose prose-gray max-w-none mb-8">
                  <div 
                    dangerouslySetInnerHTML={{ __html: product.description }}
                    className="text-gray-700 leading-relaxed"
                  />
                </div>

                <div className="mb-6">
                  <span className="text-sm font-medium text-gray-700">Category: </span>
                  <span className="text-sm text-gray-600">{product.category || 'General'}</span>
                </div>

                <div className="mb-8">
                  {(product.stock || 0) > 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-700 font-medium">In Stock ({product.stock || 0} available)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-red-600 font-medium">Out of Stock</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                disabled={(product.stock || 0) === 0}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {(product.stock || 0) > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;