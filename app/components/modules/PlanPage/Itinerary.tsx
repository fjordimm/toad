import React, { useEffect, useMemo, useState } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import CalendarCard from "../Itinerary/CalendarCard";
import { dbRetrieveTripItinerary } from "~/src/databaseUtil";
import { index } from "@react-router/dev/routes";
import type { Column, Task } from "./types";
import { DndContext, DragOverlay, type DragOverEvent, type DragStartEvent } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import { arrayMove } from "@dnd-kit/sortable";
import PossibleStops from "./PossibleStops";

type ItineraryProps = {
    tripDbDoc: DocumentSnapshot | null;
}

/*
retrieveItinerary: retrieves itinerary field from trip database as array of dict days
params: tripDbDoc: DocumentSnapshot of current trip
returns: Array[{activities:... day:... stay_at: ... additional_notes:...}]
*/
async function retrieveItinerary(tripDbDoc: DocumentSnapshot){
    const ItineraryDaysList = await dbRetrieveTripItinerary(tripDbDoc);
    console.log("Retrieving Trip: " + tripDbDoc.id + "Content: "+ ItineraryDaysList);
    return ItineraryDaysList || null;
}

export default function Itinerary({tripDbDoc}: ItineraryProps){
    const [ItineraryList, setItineraryList] = useState<any[]>([]);

    useEffect(()=>{
        if (tripDbDoc){
            const fetchItinerary = async () => {
                const itinerary = await retrieveItinerary(tripDbDoc);
                if(Array.isArray(itinerary))
                    setItineraryList(itinerary || null);
            };
            fetchItinerary();
        }
        else{
            setItineraryList([]);
        }
    }, [tripDbDoc])

    const [columns, setColumns] = useState<Column[]>([]);
    console.log(columns);
    const columnsId = useMemo(() => columns.map(col => col.id), [columns]);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === 'Column') {
            setActiveColumn(event.active.data.current.column);
            return;
        }

        if (event.active.data.current?.type === 'Task') {
            setActiveTask(event.active.data.current.task);
            return;
        }
    }

    function onDragEnd() {
        setActiveTask(null);
        setActiveColumn(null);
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;
    
        const activeId = active.id;
        const overId = over.id;
    
        if (activeId === overId) return;
    
        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";
        const isOverAColumn = over.data.current?.type === "Column";
    
        setTasks((tasks) => {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            if (activeIndex === -1) return tasks;
    
            const updatedTasks = [...tasks];
    
            if (isOverATask) {
                // Dropping task on task
                const overIndex = tasks.findIndex((t) => t.id === overId);
                if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
                    updatedTasks[activeIndex] = {
                        ...updatedTasks[activeIndex],
                        columnId: tasks[overIndex].columnId,
                    };
                }
                return arrayMove(updatedTasks, activeIndex, overIndex);
            } else if (isOverAColumn) {
                // Dropping task directly on a column
                updatedTasks[activeIndex] = {
                    ...updatedTasks[activeIndex],
                    columnId: overId, // Update columnId to the new column
                };
                return updatedTasks;
            }
            return tasks;
        });
    }

    console.log(columns);
    return(
        <div className="flex flex-col gap-4 max-h-screen overflow-y-auto">
            <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
            {ItineraryList.map((item, index) =>(
                <CalendarCard 
                    key={index} 
                    activities={item.activities} 
                    day={item.day} 
                    stay_at={item.stay_at} 
                    additional_notes={item.additional_notes} 
                    tripDbDoc={tripDbDoc}
                    columns={columns}
                    setColumns={setColumns}
                    tasks={tasks}
                    setTasks={setTasks}
                />
            ))}
            <PossibleStops
                columns={columns}
                setColumns={setColumns}
                tasks={tasks}
                setTasks={setTasks}
            />
                <DragOverlay>
                        {activeTask && <TaskCard task={activeTask} />}
                        {/* {activeColumn && <ColumnContainer column={activeColumn} deleteColumn={() => {}} createTask={() => {}} tasks={[]} />} */}
                    </DragOverlay>
            </DndContext>
        </div>
    )
} 