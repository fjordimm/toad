import { useSortable } from "@dnd-kit/sortable";
import type { Column, Id } from "./types"
import {CSS} from "@dnd-kit/utilities"

interface Props{
    column: Column;
    deleteColumn: (id: Id) => void;
}

function ColumnContainer(props: Props) {
    const { column, deleteColumn } = props;
    
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
            bg-white
            w-[350px]
            h-[500px]
            max-h-[500px]
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
        <div className="flex flex-grow">
            Content
        </div>
        {/* Column footer */}
        <div>
            Footer
        </div>

    </div>
  )
}

export default ColumnContainer
