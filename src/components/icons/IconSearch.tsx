import React from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function IconSearch({ value, onChange }: Props) {
  const debouncedOnChange = useDebounce((newValue: string) => {
    onChange(newValue);
  }, 300);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search icons..."
        defaultValue={value}
        onChange={(e) => debouncedOnChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ed1c24] focus:border-transparent"
      />
    </div>
  );
}