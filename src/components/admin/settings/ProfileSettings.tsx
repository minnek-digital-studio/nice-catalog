import { useStore } from '../../../lib/store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof schema>;

export default function ProfileSettings() {
  const user = useStore((state) => state.user);
  const updateProfile = useStore((state) => state.updateProfile);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: user?.full_name || '',
      email: user?.email || '',
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to update profile');
      } else {
        toast.error('Failed to update profile');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="full_name"
          {...register('full_name')}
          className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-[#ed1c24] focus:border-[#ed1c24] sm:text-sm border"
        />
        {errors.full_name && (
          <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-[#ed1c24] focus:border-[#ed1c24] sm:text-sm border"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#ed1c24] hover:bg-[#d91920] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed1c24] disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
          Save Changes
        </button>
      </div>
    </form>
  );
}