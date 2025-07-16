export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  brand?: string;
  category?: string;
  stock?: number;
  ean?: string;
  color?: string;
  size?: string;
  availability?: string;
  short_description?: string;
  internal_id?: string;
  // For search results
  rank?: number;
  // Computed fields for compatibility
  image?: string;
  rating?: number;
  reviews?: number;
}

export interface ProductsResponse {
  products: Product[];
  total?: number;
  page: number;
  limit: number;
  hasMore?: boolean;
}

export interface SearchResponse {
  products: Product[];
  page: number;
  limit: number;
  total: number;
  searchTerm: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}