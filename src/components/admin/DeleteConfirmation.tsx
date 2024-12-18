import { AlertTriangle } from 'lucide-react';

interface Props {
  obj: {
    id: string;
    title: string;
    type: string;
  };
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export default function DeleteConfirmation({ obj, onClose, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
          Delete {obj.type}
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          Are you sure you want to delete "{obj.title}"? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed1c24]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={async () => {
                await onConfirm(obj.id);
                onClose();
            }}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}