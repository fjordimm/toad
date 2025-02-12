import React, { useMemo, useState } from 'react';
import type { Column, Id, Task } from './types';
import ColumnContainer from './ColumnContainer';
import { DndContext, DragOverlay, type DragOverEvent, type DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([]);
    console.log(columns);
    const columnsId = useMemo(() => columns.map(col => col.id), [columns]);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);

    function createTask(columnId: Id) {
        const newTask: Task = {
            id: generateId(),
            columnId,
            content: `Task ${tasks.length + 1}`,
        };

        setTasks([...tasks, newTask]);
    }

    function createNewColumn() {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`,
        };

        setColumns([...columns, columnToAdd]);
    }

    function deleteColumn(id: Id) {
        const filteredColumns = columns.filter(col => col.id !== id);
        setColumns(filteredColumns);
    }

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
    

    return (
        <div
            className="
            m-auto
            flex
            min-h-screen
            w-full
            items-center
            overflow-x-auto
            overflow-y-auto">
            <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
                <div className="m-auto flex gap-4">
                    <div className="flex gap-4">
                        {/* <SortableContext items={columnsId}> */}
                            {columns.map(col => (
                                <ColumnContainer
                                    key={col.id}
                                    column={col}
                                    deleteColumn={deleteColumn}
                                    createTask={createTask}
                                    tasks={tasks.filter(task => task.columnId === col.id)}
                                />
                            ))}
                        {/* </SortableContext> */}
                    </div>
                    <button
                        onClick={createNewColumn}
                        className="
                        h-[60px] 
                        w-[350px] 
                        cursor-pointer 
                        rounded-lg 
                        border-2">
                        Add Column
                    </button>
                </div>

                {/* Drag Overlay should be here */}
                <DragOverlay>
                    {activeTask && <TaskCard task={activeTask} />}
                    {/* {activeColumn && <ColumnContainer column={activeColumn} deleteColumn={() => {}} createTask={() => {}} tasks={[]} />} */}
                </DragOverlay>
            </DndContext>
        </div>
    );
}


function generateId() {
    return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;
