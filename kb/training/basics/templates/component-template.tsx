import React from 'react';
import { ComponentProps } from '@/types';

interface Props extends ComponentProps {
  // Add component-specific props here
  title?: string;
  description?: string;
  onClick?: () => void;
}

export const ComponentName: React.FC<Props> = ({
  className,
  id,
  style,
  children,
  title = 'Default Title',
  description,
  onClick,
}) => {
  // Add hooks here
  const handleClick = React.useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  return (
    <div
      id={id}
      className={className}
      style={style}
      onClick={handleClick}
    >
      {title && <h2>{title}</h2>}
      {description && <p>{description}</p>}
      {children}
    </div>
  );
};

// Add component documentation
/**
 * ComponentName
 * 
 * Description: A reusable component template that demonstrates common patterns
 * 
 * Props:
 * - className?: string - Optional CSS class name
 * - id?: string - Optional HTML id attribute
 * - style?: React.CSSProperties - Optional inline styles
 * - children?: React.ReactNode - Optional child elements
 * - title?: string - Optional title text (defaults to 'Default Title')
 * - description?: string - Optional description text
 * - onClick?: () => void - Optional click handler
 * 
 * Usage:
 * ```tsx
 * <ComponentName
 *   title="My Component"
 *   description="This is a sample component"
 *   onClick={() => console.log('Clicked!')}
 * >
 *   <p>Child content goes here</p>
 * </ComponentName>
 * ```
 */ 