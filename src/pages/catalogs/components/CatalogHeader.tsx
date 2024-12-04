import React from 'react';

interface Props {
  name: string;
  description?: string | null;
}

export default function CatalogHeader({ name, description }: Props) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
        {description && (
          <p className="mt-2 text-gray-600">{description}</p>
        )}
      </div>
    </header>
  );
}