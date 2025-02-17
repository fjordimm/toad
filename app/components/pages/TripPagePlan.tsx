import ToadCount from "../modules/ToadCount";
import { debugLogComponentRerender, debugLogMessage } from "~/src/debugUtil";
import { useTripPageLayoutContext, type TripPageLayoutContext } from "./TripPageLayout";
import { Link } from "react-router";
import Itinerary from "../modules/PlanPage/Itinerary";
import { DndContext, DragOverlay, useDraggable, useDroppable, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { useState, type ReactNode } from "react";
import PossibleStops from "../modules/PlanPage/PossibleStops";
import { dbAddDestinationToItineraryDay, dbRemoveDestinationFromAllItineraryDays } from "~/src/databaseUtil";
import { useSortable } from "@dnd-kit/sortable";
import DestinationBox from "../modules/PlanPage/DestinationBox";
import type { DocumentSnapshot } from "firebase/firestore";

export function DestinationDroppable(props: { id: string, children: ReactNode }) {

	const { setNodeRef } = useDroppable({ id: props.id });

	return (
		<div ref={setNodeRef} className="grow flex items-stretch justify-stretch">
			{props.children}
		</div>
	);
}

// export function DestinationDraggable(props: { id: string, children: ReactNode }) {
// 	const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: props.id });

// 	return (
// 		<div
// 			ref={setNodeRef} {...listeners} {...attributes} className="flex justify-center items-center"
// 			style={ {
// 				transform: transform ? `translate3d(${transform?.x}px, ${transform?.y}px, 0)` : undefined,
// 				zIndex: transform ? 1 : 0,
// 				cursor: "auto"
// 			} }
// 		>
// 			{props.children}
// 		</div>
// 	);
// }

export function DestinationDraggable(props: { id: string, children: ReactNode }) {

	const { attributes, listeners, setNodeRef } = useDraggable({ id: props.id });

	return (
		<div ref={setNodeRef} {...listeners} {...attributes} className="flex justify-center items-center cursor-auto">
			{props.children}
		</div>
	);
}

function DndSortable(props: { id: string, children: ReactNode }) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });

	return (
		<div
			ref={setNodeRef} {...listeners} {...attributes} className="flex justify-center items-center"
			style={ {
				transform: transform ? `translate3d(${transform?.x}px, ${transform?.y}px, 0)` : undefined,
				transition,
				zIndex: transform ? 1 : 0,
				cursor: "auto"
			} }
		>
			{props.children}
		</div>
	);
}

export function SortableDestinationBox(props: { tripDbDoc: DocumentSnapshot, activeDraggableId: string | null, destinationId: string, destinationObj: any } ) {
	if (props.activeDraggableId !== props.destinationId) {
		return (
			<DndSortable id={props.destinationId}>
				<DestinationBox
					tripDbDoc={props.tripDbDoc}
					destinationId={props.destinationId}
					name={props.destinationObj.name}
					price={props.destinationObj.price}
					length={props.destinationObj.length}
					time={props.destinationObj.time}
					description={props.destinationObj.description}
				/>
			</DndSortable>
		);
	} else {
		return (
			<DndSortable id={props.destinationId}>
				<p>ahhhhhhhh</p>
			</DndSortable>
		);
	}
}

export default function TripPagePlan() {

	debugLogComponentRerender("TripPagePlan");

	const tripPageLayoutContext: TripPageLayoutContext = useTripPageLayoutContext();

	const listOfDestinations: { [key: string]: any } = tripPageLayoutContext.tripDbDoc.get("destinations");

	const [activeDraggableId, setActiveDraggableId] = useState<string | null>(null);

	function handleDragStart(e: DragStartEvent) {
		setActiveDraggableId(e.active.id.toString());
	}

	async function handleDragEnd(e: DragEndEvent) {
		// if (e.over !== null) {
		// 	if (e.over.id.toString().includes("calendarcard_")) {
		// 		const dayIndex: number = parseInt(e.over.id.toString().slice("calendarcard_".length));

		// 		await dbRemoveDestinationFromAllItineraryDays(tripPageLayoutContext.tripDbDoc.ref, e.active.id.toString());
		// 		await dbAddDestinationToItineraryDay(tripPageLayoutContext.tripDbDoc.ref, dayIndex, e.active.id.toString());
		// 	} else if (e.over.id.toString() === "possiblestops") {
		// 		await dbRemoveDestinationFromAllItineraryDays(tripPageLayoutContext.tripDbDoc.ref, e.active.id.toString());
		// 	}
		// }
		
		setActiveDraggableId(null);
		console.log("yipeeeee");
	}

	function TEMPTHING(activityId: string) {
		const activityObj = listOfDestinations[activityId];

		return (
			<DestinationBox tripDbDoc={tripPageLayoutContext.tripDbDoc} destinationId={activityId} name={activityObj.name} price={activityObj.price} length={activityObj.length} time={activityObj.time} description={activityObj.description} />
		);
	}

	return (
		<div className="grow flex flex-col gap-5 bg-dashboard_lime">
			<div className="py-1 px-4 bg-dashboard_component_bg rounded-lg w-min h-min">
				<Link to="./.." className="font-sunflower text-sidebar_deep_green underline">Back</Link>
			</div>

			<div className="grow flex flex-row gap-5">
				<DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
					<Itinerary tripDbDoc={tripPageLayoutContext.tripDbDoc} listOfDestinations={listOfDestinations} activeDraggableId={activeDraggableId} />
					<PossibleStops tripDbDoc={tripPageLayoutContext.tripDbDoc} listOfDestinations={listOfDestinations} />
					
					<DragOverlay>
						{
							activeDraggableId !== null ? (
								TEMPTHING(activeDraggableId)
							) : null
						}
					</DragOverlay>
				</DndContext>
			</div>
		</div>
	);
}
