import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <img 
    src="/logo-header.png" 
    alt="THIRTEEN PROJECT" 
    className={`w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02] ${className}`} 
  />
);

export default Logo;
