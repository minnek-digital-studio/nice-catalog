import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { checkCatalogUrlAvailability } from '../../lib/api';
import { catalogUrlSchema } from '../../lib/validators';
import { Check, X, Loader2, Link } from 'lucide-react';
import { useStore } from '../../lib/store';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onValidityChange: (isValid: boolean) => void;
  initialValue?: string;
}

export default function CatalogUrlInput({ value, onChange, onValidityChange, initialValue }: Props) {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const user = useStore((state) => state.user);
  
  const debouncedUrl = useDebounce(value, 500);

  useEffect(() => {
    const checkAvailability = async () => {
      if (!debouncedUrl) {
        setIsAvailable(null);
        onValidityChange(false);
        return;
      }

      try {
        // First validate the format
        const result = catalogUrlSchema.safeParse(debouncedUrl);
        if (!result.success) {
          setValidationError(result.error.errors[0].message);
          setIsAvailable(null);
          onValidityChange(false);
          return;
        }
        setValidationError(null);

        // Skip availability check if it's the initial value
        if (debouncedUrl === initialValue) {
          setIsAvailable(true);
          onValidityChange(true);
          return;
        }

        // Then check availability
        setIsChecking(true);
        const available = await checkCatalogUrlAvailability(debouncedUrl);
        setIsAvailable(available);
        onValidityChange(available);
      } catch (error) {
        console.error('Error checking catalog URL:', error);
        setIsAvailable(null);
        onValidityChange(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAvailability();
  }, [debouncedUrl, onValidityChange, initialValue]);

  return (
    <div>
      <label htmlFor="catalogUrl" className="block text-sm font-medium text-gray-700">
        Catalog URL
      </label>
      <div className="mt-1 relative">
        <div className="flex rounded-md shadow-sm">
          <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
            /{user?.username}/
          </span>
          <input
            type="text"
            id="catalogUrl"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`flex-1 rounded-none rounded-r-md sm:text-sm border px-3 ${
              validationError || !isAvailable
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : isAvailable
                ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                : 'border-gray-300 focus:ring-[#ed1c24] focus:border-[#ed1c24]'
            }`}
            placeholder="my-catalog"
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
      </div>
      {validationError ? (
        <p className="mt-2 text-sm text-red-600">{validationError}</p>
      ) : value && !isChecking && !isAvailable && !validationError ? (
        <p className="mt-2 text-sm text-red-600">This URL is already taken</p>
      ) : value && isAvailable ? (
        <p className="mt-2 text-sm text-green-600 flex items-center">
          <Link className="w-4 h-4 mr-1" />
          Your catalog will be available at /{user?.username}/{value}
        </p>
      ) : (
        <p className="mt-2 text-sm text-gray-500">
          Choose a URL-friendly name for your catalog
        </p>
      )}
    </div>
  );
}