import React, { useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  // Create optimized image URL (assuming your backend supports this)
  // For now, use the image URL as-is since backend serves static files
  const optimizedSrc = src.startsWith('http') ? src : `http://localhost:3000/images/${src}`;

  return (
    <div 
      ref={ref}
      className={`relative overflow-hidden bg-gray-200 ${className}`}
      style={{ width, height }}
    >
      {inView && (
        <>
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
          )}
          {hasError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
              <span className="text-sm">Image not found</span>
            </div>
          ) : (
            <img
              src={optimizedSrc}
              alt={alt}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleLoad}
              onError={handleError}
              loading={loading}
              decoding="async"
              width={width}
              height={height}
            />
          )}
        </>
      )}
    </div>
  );
};

export default LazyImage;