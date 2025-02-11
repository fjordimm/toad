import { SortableContext, useSortable } from "@dnd-kit/sortable";
import type { Column, Id, Task } from "./types"
import {CSS} from "@dnd-kit/utilities"
import TaskCard from "./TaskCard";
import { useMemo } from "react";

interface Props{
    column: Column;
    deleteColumn: (id: Id) => void;

    createTask: (columnId: Id) => void;
    tasks: Task[];
}

function ColumnContainer(props: Props) {
    const { column, deleteColumn, createTask, tasks } = props;
    
    const tasksIds = useMemo(() => {
        return tasks.map(tasks => tasks.id)
    },[tasks]);

    const { setNodeRef, attributes, listeners, transform, transition} 
    = 
        useSortable({
            id: column.id,
            data: {
                type: "Column",
                column,
            },
        });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),

    };
    
    return (
    <div
        ref={setNodeRef}
        style={style}
        className="
            h-full
            min-h-full
            w-4/5
            rounded-md
            flex
            flex-col
        "
    >
        {/* Column Title */}
        <div 
            {...attributes}
            {...listeners}
            className="flex gap-2">
            
            <div className="
                flex
                justify-center
                px-0
                py-1
                text-sm
                rounded-full
            ">
                0
            </div>
            {column.title}
            <button
                onClick={() => {
                    deleteColumn(column.id)
                }}
            >Delete</button>
        </div>
        
        {/* Column task container */}
        <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden">
            <SortableContext items={tasksIds}>
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </SortableContext>
        </div>
        {/* Column footer */}
        <div>
            <button onClick={() => {
                createTask(column.id);
            }}>ADD TASK</button>
        </div>

    </div>
  )
}

export default ColumnContainer
