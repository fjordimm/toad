import ToadCount from "../modules/ToadCount";
import { debugLogComponentRerender, debugLogMessage } from "~/src/debugUtil";
import { useTripPageLayoutContext, type TripPageLayoutContext } from "./TripPageLayout";
import { Link } from "react-router";
import Itinerary from "../modules/PlanPage/Itinerary";
import { DndContext, useDraggable, useDroppable, type DragEndEvent } from "@dnd-kit/core";
import { useState, type ReactNode } from "react";
import PossibleStops from "../modules/PlanPage/PossibleStops";
import { dbAddDestinationToItineraryDay, dbRemoveDestinationFromAllItineraryDays } from "~/src/databaseUtil";

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

export default function TripPagePlan() {

	debugLogComponentRerender("TripPagePlan");

	const tripPageLayoutContext: TripPageLayoutContext = useTripPageLayoutContext();

	const tripName = tripPageLayoutContext.tripDbDoc.get("trip_name");

	const listOfDestinations: { [key: string]: any } = tripPageLayoutContext.tripDbDoc.get("destinations");

	async function handleDragEnd(e: DragEndEvent) {
		if (e.over !== null) {
			if (e.over.id.toString().includes("calendarcard_")) {
				const dayIndex: number = parseInt(e.over.id.toString().slice("calendarcard_".length));

				await dbRemoveDestinationFromAllItineraryDays(tripPageLayoutContext.tripDbDoc.ref, e.active.id.toString());
				await dbAddDestinationToItineraryDay(tripPageLayoutContext.tripDbDoc.ref, dayIndex, e.active.id.toString());
			} else if (e.over.id.toString() === "possiblestops") {
				await dbRemoveDestinationFromAllItineraryDays(tripPageLayoutContext.tripDbDoc.ref, e.active.id.toString());
			}
		}
	}

	return (
		<div className="grow flex flex-col gap-5 bg-dashboard_lime">
			<div className="">
				<Link to="./.." className="bg-dashboard_component_bg py-2 px-4 rounded-lg font-sunflower text-sidebar_deep_green underline">Back</Link>
			</div>

			<div className="grow flex flex-row gap-5 justify-between">
				{/* <DndContext onDragEnd={handleDragEnd}>
					<div className="bg-slate-100 flex flex-row p-5 gap-5">
						<div className="bg-emerald-700 flex flex-col p-5 gap-5">
							{
								parent === null
								? myDraggableElem
								: null
							}
						</div>

						{
							containers.map((id: string) => (
								<MyDroppable key={id} id={id}>
									{
										id === parent
										? myDraggableElem
										: <p>Drop Here</p>
									}
								</MyDroppable>
							))
						}
					</div>
				</DndContext> */}

				<DndContext onDragEnd={handleDragEnd}>
					<Itinerary tripDbDoc={tripPageLayoutContext.tripDbDoc} listOfDestinations={listOfDestinations} />
					<PossibleStops tripDbDoc={tripPageLayoutContext.tripDbDoc} listOfDestinations={listOfDestinations} />
				</DndContext>
			</div>
		</div>
	);
}
