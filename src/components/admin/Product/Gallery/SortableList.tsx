import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { Active, Over } from "@dnd-kit/core";
import {
    PointerSensor,
    useSensor,
    useSensors,
    TouchSensor,
    KeyboardSensor,
} from "@dnd-kit/core";
type Item = { id: string };

interface SortableListProps {
    children: React.ReactNode;
    items: string[];
    onDragEnd: (newItems: Item[], active: Active, over: Over) => void;
    objItems: Item[];
}

export const SortableList: React.FC<SortableListProps> = ({
    children,
    items,
    onDragEnd,
    objItems,
}) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 30,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 30,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over?.id === active?.id) return;
        const oldIndex = objItems.findIndex((item) => item.id === active?.id);
        const newIndex = objItems.findIndex((item) => item.id === over?.id);
        const newItems = arrayMove(objItems, oldIndex, newIndex);
        onDragEnd(newItems, active, over as Over);
    };

    return (
        <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            sensors={sensors}
        >
            <SortableContext items={items} strategy={rectSortingStrategy}>
                {children}
            </SortableContext>
        </DndContext>
    );
};

export default SortableList;
