import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  message: string;
}

export default function SubscriptionLimitWarning({ message }: Props) {
  return (
    <div className="rounded-lg bg-amber-50 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
        </div>
        <div className="ml-3 flex max-md:flex-col md:items-center md:justify-between gap-4 w-full">
          <div className='flex flex-col'>
            <h3 className="text-sm font-medium text-amber-800">Subscription Limit Reached</h3>
            <div className="mt-2 text-sm text-amber-700">
              <p>{message}</p>
            </div>
          </div>
          
          <div>
            <Link
              to="/admin/settings"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#ed1c24] hover:bg-[#d91920] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed1c24]"
            >
              Upgrade Your Plan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}