import ToadCount from "../modules/ToadCount";
import { debugLogComponentRerender, debugLogMessage } from "~/src/debugUtil";
import { useTripPageLayoutContext, type TripPageLayoutContext } from "./TripPageLayout";
import { Link } from "react-router";
import Itinerary from "../modules/PlanPage/Itinerary";
import { DndContext, useDraggable, useDroppable, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { useState, type ReactNode } from "react";
import PossibleStops from "../modules/PlanPage/PossibleStops";
import { dbAddDestinationToItineraryDay, dbRemoveDestinationFromAllItineraryDays } from "~/src/databaseUtil";
import { useSortable } from "@dnd-kit/sortable";

export function DestinationDroppable(props: { id: string, children: ReactNode }) {

	const { setNodeRef } = useDroppable({ id: props.id });

	return (
		<div ref={setNodeRef} className="grow bg-blue-800 p-1 flex items-stretch justify-stretch">
			{props.children}
		</div>
	);
}

export function DestinationDraggable(props: { id: string, children: ReactNode }) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: props.id });

	return (
		<div
			ref={setNodeRef} {...listeners} {...attributes} className="bg-violet-300 p-1 flex justify-center items-center"
			style={ {
				transform: transform ? `translate3d(${transform?.x}px, ${transform?.y}px, 0)` : undefined,
				zIndex: transform ? 1 : 0,
				cursor: "auto"
			} }
		>
			{props.children}
		</div>
	);
}

export function DestinationSortable(props: { id: string, children: ReactNode }) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });

	return (
		<div
			ref={setNodeRef} {...listeners} {...attributes} className="bg-violet-300 p-1 flex justify-center items-center"
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

export default function TripPagePlan() {

	debugLogComponentRerender("TripPagePlan");

	const tripPageLayoutContext: TripPageLayoutContext = useTripPageLayoutContext();

	const listOfDestinations: { [key: string]: any } = tripPageLayoutContext.tripDbDoc.get("destinations");

	function handleDragStart(e: DragStartEvent) {

	}

	async function handleDragEnd(e: DragEndEvent) {
		if (e.over !== null) {
			if (e.over.id.toString().includes("calendarcard_")) {
				const dayIndex: number = parseInt(e.over.id.toString().slice("calendarcard_".length));

				await dbRemoveDestinationFromAllItineraryDays(tripPageLayoutContext.tripDbDoc.ref, e.active.id.toString());
				await dbAddDestinationToItineraryDay(tripPageLayoutContext.tripDbDoc.ref, dayIndex, e.active.id.toString());
			} else if (e.over.id.toString() === "possiblestops") {
				await dbRemoveDestinationFromAllItineraryDays(tripPageLayoutContext.tripDbDoc.ref, e.active.id.toString());
			}

			// console.log("yipeeeee");
		}
	}

	return (
		<div className="grow flex flex-col gap-5 bg-dashboard_lime">
			<div className="py-1 px-4 bg-dashboard_component_bg rounded-lg w-min h-min">
				<Link to="./.." className="font-sunflower text-sidebar_deep_green underline">Back</Link>
			</div>

			<div className="grow flex flex-row gap-5">
				<DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
					<Itinerary tripDbDoc={tripPageLayoutContext.tripDbDoc} listOfDestinations={listOfDestinations} />
					<PossibleStops tripDbDoc={tripPageLayoutContext.tripDbDoc} listOfDestinations={listOfDestinations} />
				</DndContext>
			</div>
		</div>
	);
}
