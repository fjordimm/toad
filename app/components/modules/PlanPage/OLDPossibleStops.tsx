import { useEffect, useState } from 'react';
import ColumnContainer from './ColumnContainer';
import type { Column, Id, Task } from './types';

type PossibleStopsProps = {
    columns: Column[];
    setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

const PossibleStops: React.FC<PossibleStopsProps> = ({ columns, setColumns, tasks, setTasks }) => {

    function createTask(columnId: Id) {
        const newTask: Task = {
            id: generateId(),
            columnId,
            content: `Task ${tasks.length + 1}`,
        };

        setTasks([...tasks, newTask]);
    }

    const createNewColumn = () => {
        const newColumn: Column = { id: "PossibleStops", title: `PossibleStops` };
        setColumns(prevColumns => [...prevColumns, newColumn]);
        console.log(columns);
        return newColumn;
    };

    function deleteColumn(id: Id) {
        setColumns(prevColumns => prevColumns.filter(col => col.id !== id));
    }

    function generateId() {
        return Math.floor(Math.random() * 10001);
    }

    const [col, setCol] = useState<Column | null>(null);

    useEffect(() => {
        const newColumn = createNewColumn(); // Generates a unique ID
        setCol(newColumn);
    }, []); // Empty dependency array ensures it runs only once

    if (!col) return null;

    return (
        <div className="absolute right-4 top-8 bottom-8 border border-black w-1/6 h-full overflow-auto">
            <h1 className='text-center font-[sunflower] mt-8 text-2xl text-sidebar_deep_green'>Possible Stops</h1>
            <div className="flex justify-center">
                <hr className="h-px my-4 border-sidebar_deep_green w-4/5 border-[1px]" />
            </div>
            <div className="flex justify-center">
                <ColumnContainer
                    key={col.id}
                    column={col}
                    deleteColumn={deleteColumn}
                    createTask={createTask}
                    tasks={tasks.filter(task => task.columnId === col.id)}
                />
            </div>
            <div className="flex-shrink-0 flex justify-center my-4">
                <button className="relative flex items-center justify-center py-2 px-4 rounded-lg shadow-md w-4/5 max-w-xs">
                    <span className="absolute rounded-lg inset-0 bg-[#3C533A] opacity-75"></span>
                    <span className="relative text-center text-white font-sunflower text-lg">
                        Add A Destination
                    </span>
                </button>
            </div>
        </div>
    );
};

export default PossibleStops;
