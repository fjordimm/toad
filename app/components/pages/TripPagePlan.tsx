/*
 Description:
  The page (with url '/trip/:tripId/plan') representing the users' plans for which destinations they will go to.
  The Itinerary component is on the left, and the PossibleStops component is on the right.
  You can drag destinations between the two.
  This file also contains helper components for using the @dnd-kit/sortable library.
 
 Interactions:
  - Parent Component(s): TripPageLayout (as Outlet)
  - Direct Children Component(s): Itinerary, PossibleStops, DestinationBox
  - Database: Firestore writes
*/

import React from "react";
import { debugLogComponentRerender } from "~/src/debugUtil";
import { useTripPageLayoutContext, type TripPageLayoutContext } from "./TripPageLayout";
import { Link } from "react-router";
import Itinerary from "../modules/TripPagePlan/Itinerary";
import { DndContext, DragOverlay, useDraggable, useDroppable, type DragEndEvent, type DragOverEvent, type DragStartEvent } from "@dnd-kit/core";
import { useState, type ReactNode } from "react";
import PossibleStops from "../modules/TripPagePlan/PossibleStops";
import { useSortable } from "@dnd-kit/sortable";
import DestinationBox from "../modules/TripPagePlan/DestinationBox";
import type { DocumentSnapshot } from "firebase/firestore";
import { dbMoveDestination, dbSortDestinationWithinDay } from "~/src/databaseUtil";

// The outline of a destination you see while dragging it, before dropping it
const destinationBoxShadow = <div className="w-full my-1 max-w-96 h-[86px] rounded-lg bg-[#00000020]"></div>;

// A utility component for making destinations draggable
export function DestinationDroppable(props: { id: string, children: ReactNode }) {

    const { setNodeRef } = useDroppable({ id: props.id });

    return (
        <div ref={setNodeRef} className="grow max-w-full min-w-0 flex flex-col">
            {props.children}
        </div>
    );
}

// A utility component for making destinations draggable
function DndDraggable(props: { id: string, children: ReactNode }) {

    const { attributes, listeners, setNodeRef } = useDraggable({ id: props.id });

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} className="max-w-full cursor-auto flex flex-col justify-center">
            {props.children}
        </div>
    );
}

// A utility component for making destinations draggable
// To be used by PossibleStops
export function DraggableDestinationBox(props: { tripDbDoc: DocumentSnapshot, activeDraggableId: string | null, destinationId: string, destinationObj: any }) {
    if (props.activeDraggableId !== props.destinationId) {
        return (
            <DndDraggable id={props.destinationId}>
                <div className="max-w-full my-1">
                    <DestinationBox
                        tripDbDoc={props.tripDbDoc}
                        destinationId={props.destinationId}
                        name={props.destinationObj.name}
                        price={props.destinationObj.price}
                        length={props.destinationObj.length}
                        time={props.destinationObj.time}
                        description={props.destinationObj.description}
                    />
                </div>
            </DndDraggable>
        )
    } else {
        return destinationBoxShadow;
    }
}

// A utility component for making destinations draggable
function DndSortable(props: { id: string, children: ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });

    return (
        <div
            ref={setNodeRef} {...listeners} {...attributes} className="flex justify-stretch items-stretch"
            style={{
                transform: transform ? `translate3d(${transform?.x}px, ${transform?.y}px, 0)` : undefined,
                transition,
                zIndex: transform ? 1 : 0,
                cursor: "auto"
            }}
        >
            {props.children}
        </div>
    );
}

// A utility component for making destinations draggable
export function SortableDestinationBox(props: { tripDbDoc: DocumentSnapshot, activeDraggableId: string | null, destinationId: string, destinationObj: any }) {
    if (props.activeDraggableId !== props.destinationId) {
        return (
            <DndSortable id={props.destinationId}>
                <div className="grow max-w-full my-1">
                    <DestinationBox
                        tripDbDoc={props.tripDbDoc}
                        destinationId={props.destinationId}
                        name={props.destinationObj.name}
                        price={props.destinationObj.price}
                        length={props.destinationObj.length}
                        time={props.destinationObj.time}
                        description={props.destinationObj.description}
                    />
                </div>
            </DndSortable>
        );
    } else {
        return (
            <DndSortable id={props.destinationId}>
                {destinationBoxShadow}
            </DndSortable>
        );
    }
}

export default function TripPagePlan() {

    debugLogComponentRerender("TripPagePlan");

    const tripPageLayoutContext: TripPageLayoutContext = useTripPageLayoutContext();

    const listOfDestinations: { [key: string]: any } = tripPageLayoutContext.tripDbDoc.get("destinations");

    const [activeDraggableId, setActiveDraggableId] = useState<string | null>(null);

    // The action will be done on drag end
    let activityMoveAction: { id: string, day: number } | null = null;

    function handleDragStart(e: DragStartEvent) {
        setActiveDraggableId(e.active.id.toString());
    }

    async function handleDragEnd(e: DragEndEvent) {
        if (activityMoveAction !== null) {
            await dbMoveDestination(tripPageLayoutContext.tripDbDoc.ref, activityMoveAction.day, activityMoveAction.id);
        }

        if (e.over !== null) {
            if (!e.over.id.toString().includes("calendarcard_") && e.over.id.toString() !== "possiblestops") { // This means it is a destination id
                await dbSortDestinationWithinDay(tripPageLayoutContext.tripDbDoc.ref, e.active.id.toString(), e.over.id.toString());
            }
        }

        setActiveDraggableId(null);
    }

    async function handleDragOver(e: DragOverEvent) {
        if (e.collisions !== null) {
            for (let i = e.collisions.length - 1; i >= 0; i--) { // Important that this is in reverse order
                if (e.collisions[i].id.toString().includes("calendarcard_")) {
                    const dayIndex: number = parseInt(e.collisions[i].id.toString().slice("calendarcard_".length));

                    activityMoveAction = { id: e.active.id.toString(), day: dayIndex };
                } else if (e.collisions[i].id.toString() === "possiblestops") {
                    activityMoveAction = { id: e.active.id.toString(), day: -1 };
                }
            }
        }
    }

    function makeActiveDragOverlay(activityId: string) {
        const activityObj = listOfDestinations[activityId];

        return (
            <DestinationBox tripDbDoc={tripPageLayoutContext.tripDbDoc} destinationId={activityId} name={activityObj.name} price={activityObj.price} length={activityObj.length} time={activityObj.time} description={activityObj.description} />
        );
    }

    return (
        <div className="max-w-full flex flex-col gap-5 bg-dashboard_lime">
            <div className="py-1 px-4 bg-dashboard_component_bg rounded-lg w-min h-min">
                <Link to="./.." className="font-sunflower text-sidebar_deep_green underline">Back</Link>
            </div>

            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
                <div className="max-w-full flex flex-row justify-stretch gap-5">
                    {/* The actual content */}
                    <Itinerary tripDbDoc={tripPageLayoutContext.tripDbDoc} listOfDestinations={listOfDestinations} activeDraggableId={activeDraggableId} />
                    <PossibleStops tripDbDoc={tripPageLayoutContext.tripDbDoc} listOfDestinations={listOfDestinations} activeDraggableId={activeDraggableId} />
                </div>

                {/* Displays the destination while you are dragging it (if any), with a non-fixed position */}
                <DragOverlay>
                    {
                        activeDraggableId !== null ? (
                            makeActiveDragOverlay(activeDraggableId)
                        ) : null
                    }
                </DragOverlay>
            </DndContext>
        </div>
    );
}
