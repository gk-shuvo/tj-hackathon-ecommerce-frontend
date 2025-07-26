import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, ArrowRight, AlertTriangle, Heart, Plus, Minus } from 'lucide-react';
import { useProduct, useCategoryProducts } from '../hooks/useProducts';
import LazyImage from '../components/LazyImage';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';

const ProductDetailPage: React.FC = () => {
  const { index } = useParams<{ index: string }>();
  const { data: product, isLoading, error } = useProduct(index!);
  const { data: categoryProducts, isLoading: categoryLoading } = useCategoryProducts(product?.category || '');
  const [quantity, setQuantity] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState<'description' | 'specifications'>('description');

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

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
        <div className="mb-[60px] flex items-center">

        <Link 
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            Home
          </Link>
          <ArrowRight className="w-4 h-4 mx-2" />
          <Link 
            to="/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            Products
          </Link>
          <ArrowRight className="w-4 h-4 mx-2" />
          <span className="text-gray-500">{product.name}</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>

                <h3 className='text-gray-600 mb-6'>{product.short_description}</h3>


                <div className="text-2xl font-bold text-green-500 mb-6">
                  ${product.price}
                </div>

                <div className="mb-3">
                  <span className="text-md font-semibold text-gray-700">Category: </span>
                  <span className="text-md text-gray-600">{product.category || 'General'}</span>
                </div>


                <div className="mb-6">
                  <span className="text-md font-semibold text-gray-700">Brand: </span>
                  <span className="text-md text-gray-600">{product.brand || 'General'}</span>
                </div>

                {/* Limited Stock Alert */}
                {(product.stock || 0) > 0 && (product.stock || 0) < 50 && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span className="text-yellow-800 font-medium">
                        Limited Stock ({product.stock} remaining)
                      </span>
                    </div>
                  </div>
                )}

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

              {/* Quantity Selector */}
              {(product.stock || 0) > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= (product.stock || 0)}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  disabled={(product.stock || 0) === 0}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {(product.stock || 0) > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden mt-8">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'description'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'specifications'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Specifications
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'description' ? (
                <div className="prose prose-gray max-w-none mb-8">
                  <div 
                    dangerouslySetInnerHTML={{ __html: product.description }}
                    className="text-gray-700 leading-relaxed"
                  />
                </div>
            ) : (
              <div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 lg:pr-6">
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Name:</span>
                      <span className="text-gray-600">{product.name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Brand:</span>
                      <span className="text-gray-600">{product.brand || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Category:</span>
                      <span className="text-gray-600">{product.category || 'General'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Price:</span>
                      <span className="text-gray-600 font-semibold">${product.price}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Stock:</span>
                      <span className="text-gray-600">{product.stock || 0} units</span>
                    </div>
                  </div>
                  <div className="space-y-2 lg:pl-6">
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Internal ID:</span>
                      <span className="text-gray-600">{product.id}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Color:</span>
                      <span className="text-gray-600">{product.color || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Size:</span>
                      <span className="text-gray-600">{product.size || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="font-medium text-gray-700">EAN:</span>
                      <span className="text-gray-600">{product.ean || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Availability:</span>
                      <span className={`font-medium ${(product.stock || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(product.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Products Section */}
        {product?.category && categoryProducts && categoryProducts.products.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden mt-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Similar Products in {product.category}
              </h2>
              <p className="text-gray-600 mt-1">
                Other products you might like in this category
              </p>
            </div>
            <div className="p-6">
              {categoryLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                   {categoryProducts.products
                     .filter(p => p.id !== product.id) // Exclude current product
                     .slice(0, 8) // Show max 8 similar products
                     .map((similarProduct) => (
                     <ProductCard 
                       key={similarProduct.id} 
                       product={similarProduct} 
                     />
                   ))}
                 </div>
              )}
              
              {categoryProducts.products.filter(p => p.id !== product.id).length > 8 && (
                <div className="text-center mt-6">
                  <Link
                    to={`/products?category=${encodeURIComponent(product.category)}`}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    View All {product.category} Products
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetailPage;