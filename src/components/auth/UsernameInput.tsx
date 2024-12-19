import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { checkUsernameAvailability } from '../../lib/api';
import { usernameSchema } from '../../lib/validators';
import { Check, X, Loader2 } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onValidityChange: (isValid: boolean) => void;
}

export default function UsernameInput({ value, onChange, onValidityChange }: Props) {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const debouncedUsername = useDebounce(value, 500);

  useEffect(() => {
    const checkAvailability = async () => {
      if (!debouncedUsername) {
        setIsAvailable(null);
        onValidityChange(false);
        return;
      }

      try {
        // First validate the format
        const result = usernameSchema.safeParse(debouncedUsername);
        if (!result.success) {
          setValidationError(result.error.errors[0].message);
          setIsAvailable(null);
          onValidityChange(false);
          return;
        }
        setValidationError(null);

        // Then check availability
        setIsChecking(true);
        const available = await checkUsernameAvailability(debouncedUsername);
        setIsAvailable(available);
        onValidityChange(available);
      } catch (error) {
        console.error('Error checking username:', error);
        setIsAvailable(null);
        onValidityChange(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAvailability();
  }, [debouncedUsername, onValidityChange]);

  return (
    <div>
      <label htmlFor="username" className="block text-sm font-medium text-gray-700">
        Username
      </label>
      <div className="mt-1 relative">
        <input
          type="text"
          id="username"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`block w-full pr-10 rounded-md shadow-sm sm:text-sm px-4 py-3 border ${
            validationError || !isAvailable
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : isAvailable
              ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
              : 'border-gray-300 focus:ring-[#ed1c24] focus:border-[#ed1c24]'
          }`}
          placeholder="Choose a unique username"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {isChecking ? (
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          ) : isAvailable ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : value && !validationError ? (
            <X className="h-4 w-4 text-red-500" />
          ) : null}
        </div>
      </div>
      {validationError ? (
        <p className="mt-2 text-sm text-red-600">{validationError}</p>
      ) : value && !isChecking && !isAvailable && !validationError ? (
        <p className="mt-2 text-sm text-red-600">This username is already taken</p>
      ) : value && isAvailable ? (
        <p className="mt-2 text-sm text-green-600">Username is available</p>
      ) : null}
    </div>
  );
}