// Change with DB integration

export type Id = string | number;

export type Column = {
    id: Id;
    title: string
}


// change with component
export type Task = {
    id: Id;
    columnId: Id;
    content: string
}