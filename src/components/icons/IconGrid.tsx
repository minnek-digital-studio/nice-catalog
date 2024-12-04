import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { Virtuoso } from 'react-virtuoso';
import { chunkArray } from '../../lib/icons';

interface Props {
  icons: string[];
  selectedIcon: string;
  onSelect: (icon: string) => void;
}

const ICONS_PER_ROW = 6;

export default function IconGrid({ icons, selectedIcon, onSelect }: Props) {
  const rows = chunkArray(icons, ICONS_PER_ROW);

  return (
    <Virtuoso
      style={{ height: '400px' }}
      totalCount={rows.length}
      itemContent={index => (
        <div className="grid grid-cols-6 gap-4 py-2">
          {rows[index].map((iconName) => (
            <button
              key={iconName}
              onClick={() => onSelect(iconName)}
              className={`p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 ${
                selectedIcon === iconName ? 'bg-[#ed1c24] bg-opacity-10 ring-2 ring-[#ed1c24]' : ''
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <FontAwesomeIcon 
                  icon={['fas', iconName as IconName]} 
                  className={`text-xl ${selectedIcon === iconName ? 'text-[#ed1c24]' : 'text-gray-600'}`}
                />
                <span className="text-xs text-gray-500 truncate w-full text-center">
                  {iconName}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    />
  );
}