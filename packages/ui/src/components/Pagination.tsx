import React from "react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) => {
  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const generatePagination = () => {
    // Direct pagination for small number of pages
    if (totalPages <= 7) {
      return range(1, totalPages);
    }

    // Calculate left and right sibling indexes
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    // Determine whether to show dots
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    // Always show first and last page
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, "...", ...middleRange, "...", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightRange = range(leftSiblingIndex, totalPages);
      return [1, "...", ...rightRange];
    }

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftRange = range(1, rightSiblingIndex);
      return [...leftRange, "...", totalPages];
    }

    return range(1, totalPages);
  };

  const pages = generatePagination();

  return (
    <nav
      className={`flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 ${
        className || ""
      }`}
    >
      <div className="hidden md:-mt-px md:flex">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium ${
            currentPage === 1
              ? "cursor-not-allowed text-gray-300"
              : "text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          <svg
            className="mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Previous
        </button>

        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
                currentPage === page
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium ${
            currentPage === totalPages
              ? "cursor-not-allowed text-gray-300"
              : "text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          Next
          <svg
            className="ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Mobile pagination */}
      <div className="flex w-full items-center justify-between md:hidden">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${
            currentPage === 1
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Previous
        </button>
        <div className="text-sm text-gray-700">
          Page <span className="font-medium">{currentPage}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </div>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${
            currentPage === totalPages
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Next
        </button>
      </div>
    </nav>
  );
};
