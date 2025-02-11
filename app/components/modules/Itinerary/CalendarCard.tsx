import React, { useEffect, useMemo, useRef, useState } from "react";
import { DocumentSnapshot, Timestamp , updateDoc} from "firebase/firestore";
import { setAnalyticsCollectionEnabled } from "firebase/analytics";
import type { Column, Id, Task } from "../PlanPage/types"
import ColumnContainer from '../PlanPage/ColumnContainer';
import TaskCard from '../PlanPage/TaskCard';
import { arrayMove } from "@dnd-kit/sortable";
import { DndContext, DragOverlay, type DragOverEvent, type DragStartEvent } from "@dnd-kit/core";

// Type declarations for CalendarCard
type CalendarCardProps = {
    activities: any[];  
    day: Timestamp;
    stay_at: string;
    additional_notes: string;
    tripDbDoc: DocumentSnapshot | null;
    columns: Column[];
    setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

// CalendarCard creates SINGULAR itinerary card representing a single day

const CalendarCard: React.FC<CalendarCardProps> = ({activities, day, stay_at, additional_notes, tripDbDoc, columns, setColumns, tasks, setTasks}) => {

// DATE HANDLER ===================================================
// Interfaces with databse itinerary to get the display date of each card

    //Converts FireStore timestamp to JS date object
    const dateObject = day.toDate()

    const weekday = dateObject.toLocaleDateString("en-US", { weekday: "short" })   // Monday
    const month = dateObject.toLocaleDateString( "en-US", { month: "short" })      // January
    const dayOfMonth = dateObject.getDate();                                       // 25
    const year = dateObject.getFullYear();                                          // 2025

// ADDITIONAL NOTES HANDLER ========================================
// Interfaces with database itinerary to get and save additional notes

    // Stores/updates additional_notes content. State manages backend, Ref manages frontend
    // Use REFs to avoid unecessary rerenders
    // TODO: see if we can avoid using the state, just use Refs?
    const [ANcontent, setANcontent] = useState(additional_notes);
    const contentRef = useRef<HTMLDivElement | null> (null);

    // Sets ANcontent to div text on input
    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        setANcontent(e.currentTarget.innerText);
    }

    /*  
    SAVE: When user clicks out of the input box, save updated content to 
    additional_notes in the corresponding day in database 
    */
    const handleSave = async () => {
        if (tripDbDoc != null){
            const tripData = tripDbDoc.data();
            try{
                if(tripData && tripData.itinerary){
                    // Creates a soft copy of the `itinerary` array in database
                    const updatedItinerary = [...tripData.itinerary]
                    
                    // Search through copy to find the index of the day of the notes user has edited
                    const itineraryIndex = updatedItinerary.findIndex(
                        (item: {day: Timestamp}) => item.day.isEqual(day)
                    );

                    if(itineraryIndex != -1){

                        // Replace that array index with a dictionary where:
                        // All other fields stay the same, but additional_notes is replaced with new content (ANcontent)
                        updatedItinerary[itineraryIndex] = {
                            ...updatedItinerary[itineraryIndex],
                            additional_notes: ANcontent,
                        };

                        // Update database by replacing old itinerary with new copied array
                        await updateDoc(tripDbDoc.ref, {
                            itinerary: updatedItinerary,
                        });
                    }
                }
            }catch(e){
                console.error("Error updating additional notes: ", e);
            }
        }
    };

    // Updates in useEffect only happens when there is a change to tripDbDoc or day
    // Updates current div only if new notes are saved - preventing unecessary rerenders

    useEffect(() =>{
        if (tripDbDoc != null){
            const tripData = tripDbDoc.data();
            if(tripData && tripData.itinerary){
                const updatedNotes = tripData.itinerary.find(
                    (item: {day: Timestamp}) => item.day.isEqual(day)
                )?.additional_notes;

                // if additional_notes in database is updated - change content of div via ref
                if(contentRef.current && updatedNotes)
                    contentRef.current.innerText = updatedNotes;
            }
        }
    }, [tripDbDoc, day]);

    // const [columns, setColumns] = useState<Column[]>([]);
    // console.log(columns);
    // const columnsId = useMemo(() => columns.map(col => col.id), [columns]);

    // const [tasks, setTasks] = useState<Task[]>([]);
    // const [activeTask, setActiveTask] = useState<Task | null>(null);
    // const [activeColumn, setActiveColumn] = useState<Column | null>(null);

    function createTask(columnId: Id) {
        const newTask: Task = {
            id: generateId(),
            columnId,
            content: `Task ${tasks.length + 1}`,
        };

        setTasks([...tasks, newTask]);
    }

    const createNewColumn = (date: string) => {
        const existingColumn = columns.find(col => col.id === date);
        if (existingColumn) return existingColumn;

        const newColumn: Column = { id: date, title: `${date}` };
        setColumns(prevColumns => [...prevColumns, newColumn]);
        console.log(columns);
        return newColumn;
    };

    function deleteColumn(id: Id) {
        const filteredColumns = columns.filter(col => col.id !== id);
        setColumns(filteredColumns);
    }

    function generateId() {
        return Math.floor(Math.random() * 10001);
    }

    const [col, setCol] = useState<Column | null>(null);

    useEffect(() => {
        const newColumn = createNewColumn(`${month},${dayOfMonth},${year}`);
        setCol(newColumn);
    }, [month, dayOfMonth, year]);

    if (!col) return null;


    return (
        <div className="w-full h-64 rounded-lg bg-itinerary_card_green p-2 flex">
            {/* Date and Accommodation Column */}
            <div className="w-40 border-r-2 border-dashboard_component_bg text-sidebar_deep_green p-2">
                <h1 className="font-sunflower text-3xl" style={{ fontWeight: 900 }}>
                    <b>{weekday}</b>
                </h1>
                <p>{month} {dayOfMonth}, {year}</p>
            </div>

            {/* Draggable activities column */}
            {/* Drag-and-drop instruction */}
            <div className="w-96 font-sunflower flex items-center justify-center ">
                {/* <p className="text-sidebar_deep_green max-w-48">Drag activities from Possible Stops to plan it for this day</p> */}
                <ColumnContainer 
                    key={col.id}
                    column={col}
                    deleteColumn={deleteColumn}
                    createTask={createTask}
                    tasks={tasks.filter(task => task.columnId === col.id)}
                />
            </div>

            {/* Additional Notes column */}
            <div className="bg-toad_count_lime w-72 rounded-lg text-sidebar_deep_green">
                <div className="p-2">
                    <p className="font-sunflower text-md"><b>Additional Notes:</b></p>

                    {/* Editable textbox */}
                    <div 
                        contentEditable="true" 
                        ref={contentRef}
                        className="font-sunflower h-48 focus:outline-none"
                        onInput={handleInput}
                        onBlur={handleSave}
                        style={{ whiteSpace: "pre-wrap"}}
                    >
                    </div>
                </div>
            </div>
        </div>
    );
        
}

export default CalendarCard