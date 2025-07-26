import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/product';
import LazyImage from './LazyImage';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
  return (
    <Link 
      to={`/product/${product.index}`}
      className="group block bg-white rounded-lg shadow-sm border border-gray-300 hover:shadow-md transition-shadow duration-200 relative"
    >
      <div className='relative'>
      <div className="aspect-square">
        <LazyImage
          src={product.image_url}
          alt={product.name}
          className="w-full h-full rounded-t-lg"
          // width={300}
          // height={300}
          loading="lazy"
        />
      </div>

      <div className="flex items-center gap-1 absolute bottom-4 right-4">
          <span className="text-sm text-gray-600  bg-gray-100 rounded-xl px-2 py-1">{product.category}</span>
        </div>

      </div>
      
      <div className="p-4">
        <h2 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
          {product.name}
        </h2>

        <div className="flex items-center gap-1 mt-2">
          <span className="text-sm text-gray-600">{product.brand}</span>
        </div>

       
        
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-gray-900">${product.price}</span>
          {(product.stock || 0) > 0 ? (
            <span className="text-sm text-green-700">In Stock ({product.stock})</span>
          ) : (
            <span className="text-sm text-red-600">Out of Stock</span>
          )}
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;