import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  bordered?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  onClick?: () => void;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  position?: 'top' | 'bottom';
  height?: string;
}

// Main Card Component
const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Title: React.FC<CardTitleProps>;
  Content: React.FC<CardContentProps>;
  Footer: React.FC<CardFooterProps>;
  Image: React.FC<CardImageProps>;
} = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  bordered = true,
  shadow = 'md',
  rounded = 'xl',
  onClick,
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
    xl: 'p-8',
  };
  
  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };
  
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
  };
  
  const borderStyle = bordered ? 'border border-gray-200' : '';
  const hoverStyle = hover ? 'hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1' : '';
  const cursorStyle = onClick ? 'cursor-pointer' : '';
  
  return (
    <div
      className={`bg-white ${paddingStyles[padding]} ${shadowStyles[shadow]} ${roundedStyles[rounded]} ${borderStyle} ${hoverStyle} ${cursorStyle} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Card Header
const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '', action }) => {
  return (
    <div className={`flex items-center justify-between pb-4 mb-4 border-b border-gray-200 ${className}`}>
      <div className="flex-1">{children}</div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

// Card Title
const CardTitle: React.FC<CardTitleProps> = ({ children, className = '', as: Component = 'h3' }) => {
  const titleStyles = {
    h1: 'text-3xl font-bold',
    h2: 'text-2xl font-bold',
    h3: 'text-xl font-semibold',
    h4: 'text-lg font-semibold',
    h5: 'text-base font-semibold',
    h6: 'text-sm font-semibold',
  };
  
  return (
    <Component className={`${titleStyles[Component]} text-gray-900 ${className}`}>
      {children}
    </Component>
  );
};

// Card Content
const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return <div className={`text-gray-700 ${className}`}>{children}</div>;
};

// Card Footer
const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center justify-end space-x-3 pt-4 mt-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

// Card Image
const CardImage: React.FC<CardImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  position = 'top',
  height = 'h-48',
}) => {
  const marginClass = position === 'top' ? '-mt-5 -mx-5 mb-4' : '-mb-5 -mx-5 mt-4';
  
  return (
    <div className={`${marginClass} overflow-hidden ${height} ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

// Attach subcomponents
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Image = CardImage;

export default Card;