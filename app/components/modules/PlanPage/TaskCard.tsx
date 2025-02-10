import { useState } from "react";
import type { Task } from "./types";
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities"
import DestinationBox from "./DestinationBox";

interface Props {
    task: Task;

}





function TaskCard({task} : Props) {
    const [mouseIsOver, setMouseIsOver] = useState(false);
  
    const { setNodeRef, attributes, listeners, transform, transition, isDragging} 
    = 
        useSortable({
            id: task.id,
            data: {
                type: "Task",
                task,
            },
        });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),

    };

    if (isDragging){
        return(

            <div
                ref={setNodeRef}
                style={style}
                className="
                bg-sidebar_deep_green p-2 h-[100px] items-center flex text-left, rounded-xl cursor-grabs border-2 border-rose-500 relative opacity-30"
            ></div>
        )
    }

    return (
        <div 
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            // className="bg-blue-400 p-2 h-[100px] items-center flex text-left, rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grabs relative"
            onMouseEnter={() => {
                setMouseIsOver(true);
            }}
            onMouseLeave={() => {
                setMouseIsOver(false)
            }}
        >
            <DestinationBox/>
        </div>
  )
}

export default TaskCard
