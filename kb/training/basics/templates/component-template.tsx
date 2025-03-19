import React from 'react';
import { ComponentProps } from '@/types';
import { cn } from '@/lib/utils';

interface Props extends ComponentProps {
  // Add component-specific props here
  title?: string;
  description?: string;
  onClick?: () => void;
}

export function ExampleComponent({ className, children, title }: Props) {
  return (
    <div className={cn('p-4 rounded-lg bg-white shadow', className)}>
      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
      {children}
    </div>
  );
}

export default ExampleComponent;
