import React from 'react';
import { Switch } from '@headlessui/react';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Toggle = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className,
}: ToggleProps) => {
  const sizeStyles = {
    sm: {
      switch: 'h-4 w-7',
      dot: 'h-3 w-3',
      translate: 'translate-x-3',
    },
    md: {
      switch: 'h-6 w-11',
      dot: 'h-5 w-5',
      translate: 'translate-x-5',
    },
    lg: {
      switch: 'h-7 w-14',
      dot: 'h-6 w-6',
      translate: 'translate-x-7',
    },
  };

  const styles = sizeStyles[size];

  return (
    <div className={`flex items-center ${className || ''}`}>
      <Switch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`
          ${checked ? 'bg-indigo-600' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          relative inline-flex shrink-0 ${styles.switch} border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        `}
      >
        <span className="sr-only">{label}</span>
        <span
          aria-hidden="true"
          className={`
            ${checked ? styles.translate : 'translate-x-0'}
            pointer-events-none inline-block ${styles.dot} rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200
          `}
        />
      </Switch>
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <span
              className={`text-sm font-medium text-gray-900 ${
                disabled ? 'opacity-50' : ''
              }`}
            >
              {label}
            </span>
          )}
          {description && (
            <p
              className={`text-sm text-gray-500 ${disabled ? 'opacity-50' : ''}`}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}; 