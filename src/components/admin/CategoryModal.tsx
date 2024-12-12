import React, { useState } from "react";
import { X } from "lucide-react";
import IconPicker from "../IconPicker";
import CategoryForm from "./CategoryForm";
import type { IconName } from "@fortawesome/fontawesome-svg-core";
import type { Database } from "../../types/supabase";

interface Props {
    category?: Database["public"]["Tables"]["categories"]["Update"] | null;
    onClose: () => void;
}

export default function CategoryModal({ onClose, category }: Props) {
    const [icon, setIcon] = useState(category?.icon || "tag");
    const [showIconPicker, setShowIconPicker] = useState(false);

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">Add New Category</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <CategoryForm
                    initialData={category}
                    icon={icon as IconName}
                    onClose={onClose}
                    setShowIconPicker={setShowIconPicker}
                />
                {showIconPicker && (
                    <IconPicker
                        value={icon}
                        onChange={setIcon}
                        onClose={() => setShowIconPicker(false)}
                    />
                )}
            </div>
        </div>
    );
}
