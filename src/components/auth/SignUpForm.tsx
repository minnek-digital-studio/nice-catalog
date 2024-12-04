import React, { useState } from 'react';
import { signUp } from '../../lib/auth';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signUpSchema } from '../../lib/validators';
import UsernameInput from './UsernameInput';
import type { SignUpData } from '../../types';

export default function SignUpForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [formData, setFormData] = useState<SignUpData>({
    username: '',
    fullName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordRequirements = [
    { label: '8+ characters', test: (p: string) => p.length >= 8 },
    { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'Lowercase letter', test: (p: string) => /[a-z]/.test(p) },
    { label: 'Number', test: (p: string) => /\d/.test(p) },
    { label: 'Special character', test: (p: string) => /[!@#$%^&*]/.test(p) },
  ];

  const handleChange = (field: keyof SignUpData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const validateField = (field: keyof SignUpData, value: string) => {
    try {
      const fieldSchema = signUpSchema.pick({ [field]: true });
      fieldSchema.parse({ [field]: value });
      setErrors(prev => ({ ...prev, [field]: '' }));
      return true;
    } catch (error: any) {
      const message = error.errors[0]?.message || `Invalid ${field}`;
      setErrors(prev => ({ ...prev, [field]: message }));
      return false;
    }
  };

  const handleBlur = (field: keyof SignUpData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    let hasErrors = false;
    Object.keys(formData).forEach(key => {
      const field = key as keyof SignUpData;
      if (!validateField(field, formData[field])) {
        hasErrors = true;
      }
    });

    if (hasErrors || !isUsernameValid) {
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }

    setLoading(true);

    try {
      await signUp(formData);
      toast.success('Account created successfully!');
      navigate('/admin/catalogs');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <UsernameInput
        value={formData.username}
        onChange={(value) => handleChange('username', value)}
        onValidityChange={setIsUsernameValid}
      />

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          onBlur={() => handleBlur('fullName')}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
            touched.fullName && errors.fullName
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-[#ed1c24] focus:border-[#ed1c24]'
          }`}
        />
        {touched.fullName && errors.fullName && (
          <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
            touched.email && errors.email
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-[#ed1c24] focus:border-[#ed1c24]'
          }`}
        />
        {touched.email && errors.email && (
          <p className="mt-2 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            className={`block w-full pr-10 rounded-md shadow-sm sm:text-sm ${
              touched.password && errors.password
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-[#ed1c24] focus:border-[#ed1c24]'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {passwordRequirements.map(({ label, test }) => (
            <div key={label} className="flex items-center space-x-2">
              {test(formData.password) ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-gray-300" />
              )}
              <span className={`text-sm ${test(formData.password) ? 'text-green-500' : 'text-gray-500'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
        {touched.password && errors.password && (
          <p className="mt-2 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || !isUsernameValid}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ed1c24] hover:bg-[#d91920] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed1c24] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
}