import { type Category } from "@/components/admin/CategoryList";
import { useSortable } from "@dnd-kit/sortable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconName } from "@fortawesome/fontawesome-svg-core";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";

interface SortableRowProps {
    id: string;
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    setSelectedCategory: (category: Category) => void;
    setShowDeleteModal: (show: boolean) => void;
}

export default function SortableRow({
    id,
    category,
    onEdit,
    setSelectedCategory,
    setShowDeleteModal,
}: SortableRowProps) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li ref={setNodeRef} style={style} className="p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab mr-2"
                    >
                        <GripVertical className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                        <FontAwesomeIcon
                            icon={["fas", category.icon as IconName]}
                        />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                            {category.name}
                        </p>
                        <p className="text-sm text-gray-500">{category.slug}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onEdit(category)}
                        className="p-1 text-gray-400 hover:text-yellow-500"
                    >
                        <Pencil className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => {
                            setSelectedCategory(category);
                            setShowDeleteModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-red-500"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </li>
    );
}
