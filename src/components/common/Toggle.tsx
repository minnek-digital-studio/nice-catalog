import React, { memo } from 'react';
import { useToggleStyles } from '../../hooks/useToggleStyles';

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const Toggle = memo(function Toggle({ 
  checked, 
  onChange, 
  label, 
  id,
  size = 'md',
  disabled = false 
}: Props) {
  const { switchClass, labelClass } = useToggleStyles(size, disabled);

  return (
    <label className="inline-flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
          disabled={disabled}
          aria-label={label}
        />
        <div className={switchClass} />
      </div>
      {label && (
        <span className={labelClass}>
          {label}
        </span>
      )}
    </label>
  );
});

export default Toggle;