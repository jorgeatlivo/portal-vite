import React from 'react';

interface ExpandableContainerProps {
  children: React.ReactNode;
  width?: string;
}

export const ExpandableContainer: React.FC<ExpandableContainerProps> = ({
  children,
  width = '100%', // Default width
}) => {
  return (
    <div
      className="transition-width !m-0 flex flex-col duration-100 ease-in-out" // Add transition classes
      style={{ width }} // Inline style for dynamic width
    >
      {children}
    </div>
  );
};
