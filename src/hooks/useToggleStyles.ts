import { useMemo } from 'react';

type ToggleSize = 'sm' | 'md' | 'lg';

export function useToggleStyles(size: ToggleSize, disabled: boolean) {
  const sizes = useMemo(() => ({
    sm: {
      switch: 'w-8 h-5',
      thumb: 'h-4 w-4',
      translate: 'translate-x-3',
    },
    md: {
      switch: 'w-11 h-6',
      thumb: 'h-5 w-5',
      translate: 'translate-x-5',
    },
    lg: {
      switch: 'w-14 h-7',
      thumb: 'h-6 w-6',
      translate: 'translate-x-7',
    },
  }), []);

  const switchClass = useMemo(() => `
    ${sizes[size].switch}
    bg-gray-200 
    peer-focus:outline-none 
    peer-focus:ring-4 
    peer-focus:ring-red-100 
    rounded-full 
    peer 
    peer-checked:after:${sizes[size].translate}
    peer-checked:after:border-white 
    after:content-[''] 
    after:absolute 
    after:top-[2px] 
    after:left-[2px] 
    after:bg-white 
    after:border-gray-300 
    after:border 
    after:rounded-full 
    after:${sizes[size].thumb}
    after:transition-all 
    peer-checked:bg-[#ed1c24]
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    transition-colors duration-200
  `, [size, disabled, sizes]);

  const labelClass = useMemo(() => `
    ml-3 text-sm font-medium text-gray-700 
    ${disabled ? 'opacity-50' : ''}
  `, [disabled]);

  return {
    switchClass,
    labelClass
  };
}