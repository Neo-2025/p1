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
