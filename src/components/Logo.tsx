import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <img 
    src="/logo-header.png" 
    alt="THIRTEEN PROJECT" 
    className={`w-auto h-9 sm:h-11 md:h-12 lg:h-14 max-w-[200px] sm:max-w-[260px] md:max-w-[300px] object-contain transition-transform duration-200 group-hover:scale-[1.02] ${className}`} 
  />
);

export default Logo;
