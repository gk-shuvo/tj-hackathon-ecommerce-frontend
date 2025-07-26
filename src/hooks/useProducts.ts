import { useQuery } from '@tanstack/react-query';
import { Product, ProductsResponse, SearchResponse, CategoryProductsResponse } from '../types/product';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Transform product to add computed fields for compatibility
const transformProduct = (product: any): Product => ({
  ...product,
  image: product.image_url, // Add compatibility field
  rating: 4.5, // Default rating since not provided by API
  reviews: Math.floor(Math.random() * 100) + 10, // Random reviews for demo
  stock: product.stock || 0,
  category: product.category || 'General',
});

export const useProducts = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['products', page, limit],
    queryFn: async (): Promise<ProductsResponse> => {
      const response = await fetch(`${API_BASE_URL}/products?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      
      return {
        products: data.products.map(transformProduct),
        total: data.total || data.products.length,
        page: data.page,
        limit: data.limit,
        hasMore: data.products.length === limit, // Assume more if we got full page
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useProduct = (index: string) => {
  return useQuery({
    queryKey: ['product', index],
    queryFn: async (): Promise<Product> => {
      const response = await fetch(`${API_BASE_URL}/products/${index}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      const data = await response.json();
      return transformProduct(data);
    },
    enabled: !!index,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useLatestProducts = (limit: number = 8) => {
  return useQuery({
    queryKey: ['products', 'latest', limit],
    queryFn: async (): Promise<Product[]> => {
      const response = await fetch(`${API_BASE_URL}/products/latest?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch latest products');
      }
      const data = await response.json();
      return data.products.map(transformProduct);
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchProducts = (query: string, page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['products', 'search', query, page, limit],
    queryFn: async (): Promise<SearchResponse> => {
      const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to search products');
      }
      const data = await response.json();
      
      return {
        products: data.products.map(transformProduct),
        page: data.page,
        limit: data.limit,
        total: data.total,
        searchTerm: data.searchTerm,
      };
    },
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};

export const useCategoryProducts = (categoryName: string) => {
  return useQuery({
    queryKey: ['products', 'category', categoryName],
    queryFn: async (): Promise<CategoryProductsResponse> => {
      const response = await fetch(`${API_BASE_URL}/products/category/${encodeURIComponent(categoryName)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch category products');
      }
      const data = await response.json();
      
      return {
        products: data.products.map(transformProduct),
        category: data.category,
        count: data.count,
        categoryMatches: data.categoryMatches,
        randomProducts: data.randomProducts,
      };
    },
    enabled: !!categoryName && categoryName.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

