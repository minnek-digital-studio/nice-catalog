import { useEffect, useState } from "react";
import { useStore } from "../../lib/store";
import { Plus } from "lucide-react";
import CategoryModal from "./CategoryModal";
import { toast } from "react-hot-toast";
import type { Database } from "../../types/supabase";
import DeleteConfirmation from "./DeleteConfirmation";
import SortableRow from "@/components/admin/Category/SortableRow";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";

export type Category = Database["public"]["Tables"]["categories"]["Update"];

export default function CategoryList() {
    const [showModal, setShowModal] = useState(false);
    const { categories, fetchCategories, reorderCategories, deleteCategory } =
        useStore();
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null
    );
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleDelete = async (id: string) => {
        try {
            await deleteCategory(id);
            toast.success("Category deleted successfully");
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || "Failed to delete category");
            } else {
                toast.error("Failed to delete category");
            }
        }
    };

    const onEdit = (category: Category) => {
        setSelectedCategory(category);
        setShowModal(true);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const newIndex = categories.findIndex((c) => c.id === over.id);

            try {
                await reorderCategories(active.id as string, newIndex);
                toast.success("Category order updated");
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(
                        error.message || "Failed to update category order"
                    );
                } else {
                    toast.error("Failed to update category order");
                }
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                    Categories
                </h3>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#ed1c24] hover:bg-[#d91920]"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                </button>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <ul className="divide-y divide-gray-200">
                        <SortableContext
                            items={categories.map((c) => c.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {categories.map((category) => (
                                <SortableRow
                                    key={category.id}
                                    id={category.id}
                                    category={category}
                                    onEdit={onEdit}
                                    onDelete={(category) => {
                                        setSelectedCategory(category);
                                        setShowDeleteModal(true);
                                    }}
                                    setSelectedCategory={setSelectedCategory}
                                    setShowDeleteModal={setShowDeleteModal}
                                />
                            ))}
                        </SortableContext>
                        {categories.length === 0 && (
                            <li className="p-4 text-center text-gray-500">
                                No categories yet. Add your first category to
                                get started.
                            </li>
                        )}
                    </ul>
                </DndContext>
            </div>

            {showModal && (
                <CategoryModal
                    onClose={() => {
                        setShowModal(false);
                        setSelectedCategory(null);
                    }}
                    category={selectedCategory}
                />
            )}

            {showDeleteModal && (
                <DeleteConfirmation
                    obj={{
                        id: selectedCategory?.id || "",
                        title: selectedCategory?.name || "",
                        type: "category",
                    }}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedCategory(null);
                    }}
                    onConfirm={() => handleDelete(selectedCategory?.id || "")}
                />
            )}
        </div>
    );
}
