import React from 'react';
import type { Product } from '../types';

interface Props {
  promotion: NonNullable<Product['promotion']>;
}

export default function ProductRibbon({ promotion }: Props) {
  const backgroundColor = promotion.backgroundColor || 
    (promotion.type === 'discount' ? 'bg-rose-500' : 'bg-indigo-500');

  return (
    <div className={`absolute top-4 left-0 z-10 ${backgroundColor} text-white px-3 py-1 shadow-md`}>
      <div className="relative">
        <span className="text-sm font-medium">
          {promotion.type === 'discount' 
            ? `-${promotion.value}%`
            : promotion.value}
        </span>
        <div className={`absolute -right-3 top-0 h-full w-3 ${backgroundColor} clip-ribbon`} />
      </div>
    </div>
  );
}