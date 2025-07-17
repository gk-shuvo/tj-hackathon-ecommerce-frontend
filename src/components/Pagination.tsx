import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasMore: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  hasMore
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        aria-label='Go to the previous page'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getVisiblePages().map((page, index) => (
        <button
          aria-label={`Go to page ${page}`}
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
            page === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : page === '...'
              ? 'border-gray-300 cursor-default'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        aria-label='Go to the next page'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasMore}
        className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;