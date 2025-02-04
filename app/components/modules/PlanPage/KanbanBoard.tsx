import React, { useMemo, useState } from 'react'
import type { Column, Id } from './types';
import ColumnContainer from './ColumnContainer';
import {DndContext, type DragStartEvent} from "@dnd-kit/core";
import {SortableContext} from "@dnd-kit/sortable";


function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([]);
    console.log(columns);
    const columnsId = useMemo(() => columns.map(col => col.id), [columns]);

    const [activeColumn, setActiveColumn] = useState<Column | null>
    (null);

    function createNewColumn() {
        const columnToAdd:Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`
        };

        setColumns([...columns, columnToAdd])
    }

    function deleteColumn(id:Id){
        const filteredColumns = columns.filter(col => col.id !== id);
        setColumns(filteredColumns);
    }

    function onDragStart(event: DragStartEvent){
        if (event.active.data.current?.type === "Column"){
            setActiveColumn(event.active.data.current.column);
            return;
        }
    }

    return (
        <div
            className='
            m-auto
            flex
            min-h-screen
            w-full
            items-center
            overflow-x-auto
            overflow-y-auto'>
                
            <DndContext onDragStart={onDragStart}>
                <div className='m-auto flex gap-4'>
                        <div className='flex gap-4'>
                            <SortableContext items={columnsId}>
                            {columns.map((col) => (
                                <ColumnContainer 
                                    key={col.id}
                                    column={col} 
                                    deleteColumn={deleteColumn}/>
                                ))}
                            </SortableContext>
                        </div>
                    <button 
                        onClick={() => {createNewColumn();
                        }}
                        className='
                        h-[60px] 
                        w-[350px] 
                        cursor-pointer 
                        rounded-lg 
                        border-2'>
                        
                        Add Column
                    </button>
                </div>
            </DndContext>
        </div>
    )

    

}

function generateId(){
    return Math.floor(Math.random() * 10001)
}

export default KanbanBoard
