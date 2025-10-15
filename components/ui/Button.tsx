import React from 'react';

// FIX: Refactored Button to be a polymorphic component. This allows it to be rendered
// as different HTML elements (e.g., 'span') using the 'as' prop, which is necessary
// for valid HTML when used inside a <label> element.
type ButtonOwnProps<E extends React.ElementType = React.ElementType> = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  as?: E;
}

// FIX: Changed to use ComponentPropsWithoutRef for better type safety with polymorphic components.
type ButtonProps<E extends React.ElementType> = ButtonOwnProps<E> &
  Omit<React.ComponentPropsWithoutRef<E>, keyof ButtonOwnProps<E>>;

const defaultElement = 'button';

// FIX: Switched from a function declaration to a generic arrow function component.
// This resolves a TSX parsing issue with generic components that was causing a "does not have any construct or call signatures" error,
// which in turn fixes all the downstream "Property 'children' is missing" errors across the application.
const Button = <E extends React.ElementType = typeof defaultElement>({
  children,
  className = '',
  variant = 'primary',
  as,
  ...props
}: ButtonProps<E>) => {
  const Component = as || defaultElement;

  const baseStyles = 'inline-flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150';

  const variantStyles = {
    primary: 'border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'border-transparent text-white bg-gray-600 hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500',
    danger: 'border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <Component
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;
