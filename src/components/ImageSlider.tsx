import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  // Add low-quality placeholder for progressive loading
  placeholder?: string;
}

const slides: Slide[] = [
  {
    id: '1',
    image: '/banner-images/banner1.webp',
    title: 'Summer Collection',
    subtitle: 'Discover the latest trends',
    placeholder: '/banner-images/banner1-placeholder.webp' // 10-20KB low-res version
  },
  {
    id: '2',
    image: '/banner-images/banner2.webp',
    title: 'New Arrivals',
    subtitle: 'Fresh styles for every season',
    placeholder: '/banner-images/banner2-placeholder.webp'
  },
  {
    id: '3',
    image: '/banner-images/banner3.webp',
    title: 'Special Offers',
    subtitle: 'Up to 50% off selected items',
    placeholder: '/banner-images/banner3-placeholder.webp'
  }
];

interface OptimizedImageProps {
  src: string;
  placeholder?: string;
  alt: string;
  className: string;
  loading: 'lazy' | 'eager';
  onLoad?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  placeholder,
  alt,
  className,
  loading,
  onLoad
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaceholderLoaded, setIsPlaceholderLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handlePlaceholderLoad = () => {
    setIsPlaceholderLoaded(true);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Low-quality placeholder (blur effect) */}
      {placeholder && (
        <img
          src={placeholder}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handlePlaceholderLoad}
          loading="eager"
          decoding="async"
        />
      )}
      
      {/* Main high-quality image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleImageLoad}
        loading={loading}
        decoding="async"
        fetchPriority={loading === 'eager' ? 'high' : 'auto'}
      />
      
      {/* Loading skeleton while placeholder loads */}
      {!isPlaceholderLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      )}
    </div>
  );
};

const ImageSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState<Set<number>>(new Set([0])); // Track loaded slides
  const [isFirstSlideLoaded, setIsFirstSlideLoaded] = useState(false);

  // Preload the first slide immediately
  useEffect(() => {
    const preloadFirstSlide = () => {
      const img = new Image();
      img.src = slides[0].image;
      img.onload = () => setIsFirstSlideLoaded(true);
    };
    preloadFirstSlide();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Preload next slide when current slide changes
  useEffect(() => {
    const nextSlideIndex = (currentSlide + 1) % slides.length;
    if (!loadedSlides.has(nextSlideIndex)) {
      const img = new Image();
      img.src = slides[nextSlideIndex].image;
      img.onload = () => {
        setLoadedSlides(prev => new Set([...prev, nextSlideIndex]));
      };
    }
  }, [currentSlide, loadedSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleSlideLoad = (index: number) => {
    setLoadedSlides(prev => new Set([...prev, index]));
  };

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg">
      {/* Show loading state until first slide is ready */}
      {!isFirstSlideLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      )}

      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <OptimizedImage
            src={slide.image}
            placeholder={slide.placeholder}
            alt={slide.title}
            className="w-full h-full"
            loading={index === 0 ? 'eager' : 'lazy'}
            onLoad={() => handleSlideLoad(index)}
          />
          
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-2">{slide.title}</h2>
              <p className="text-xl">{slide.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 transition-opacity z-10 w-12 h-12 flex items-center justify-center"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 transition-opacity z-10 w-12 h-12 flex items-center justify-center"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      
      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;