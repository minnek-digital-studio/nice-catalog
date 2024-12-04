import React, { useEffect, useState, useCallback } from 'react';
import Toggle from '../../common/Toggle';
import { useProductVisibility } from '../../../hooks/useProductVisibility';

interface Props {
  onChange: (visible: boolean) => void;
}

export default function ProductVisibilityToggle({ onChange }: Props) {
  const { isVisible, toggleVisibility } = useProductVisibility();

  const handleChange = useCallback((newValue: boolean) => {
    toggleVisibility(newValue);
    onChange(newValue);
  }, [onChange, toggleVisibility]);

  return (
    <Toggle
      checked={isVisible}
      onChange={handleChange}
      label={`${isVisible ? 'Hide' : 'Show'} Products`}
      id="product-visibility-toggle"
      size="sm"
    />
  );
}