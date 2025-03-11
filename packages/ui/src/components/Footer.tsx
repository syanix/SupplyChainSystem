import React from 'react';

export interface FooterProps {
  className?: string;
}

export const Footer = ({ className }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`bg-white border-t border-gray-200 ${className || ''}`}>
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex-shrink-0">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} Supply Chain System. All rights reserved.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Privacy Policy</span>
                <span className="text-sm">Privacy Policy</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Terms of Service</span>
                <span className="text-sm">Terms of Service</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Contact</span>
                <span className="text-sm">Contact</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 