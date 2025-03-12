import React, { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  subTitle?: string;
  extra?: ReactNode;
  onBack?: () => void;
  className?: string;
}

export function PageHeader({
  title,
  subTitle,
  extra,
  onBack,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <div className="flex items-center">
        {onBack && (
          <button
            onClick={onBack}
            className="mr-2 text-gray-500 hover:text-gray-700"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subTitle && <p className="text-sm text-gray-500">{subTitle}</p>}
        </div>
      </div>
      {extra && <div className="flex items-center space-x-2">{extra}</div>}
    </div>
  );
}
