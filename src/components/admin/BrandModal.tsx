import { X } from "lucide-react";
import type { Database } from "../../types/supabase";
import BrandForm from "./BrandForm";
interface Props {
    onClose: () => void;
    brand?: Database["public"]["Tables"]["brands"]["Update"] | null;
}

export default function BrandModal({ onClose, brand }: Props) {
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">Add New Brand</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <BrandForm onClose={onClose} initialData={brand} />
            </div>
        </div>
    );
}
