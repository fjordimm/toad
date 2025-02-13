import ToadCount from "../modules/ToadCount";
import { debugLogComponentRerender, debugLogMessage } from "~/src/debugUtil";
import { useTripPageLayoutContext, type TripPageLayoutContext } from "./TripPageLayout";
import { Link } from "react-router";
import Itinerary from "../modules/PlanPage/Itinerary";
import { DndContext, useDraggable, useDroppable, type DragEndEvent } from "@dnd-kit/core";
import { useState, type ReactNode } from "react";
import PossibleStops from "../modules/PlanPage/PossibleStops";

// export function MyDroppable(props: { id: string, children: ReactNode }) {

// 	const { setNodeRef } = useDroppable({ id: props.id });

// 	return (
// 		<div ref={setNodeRef} className="bg-emerald-950 flex flex-col p-5 gap-5">
// 			{props.children}
// 		</div>
// 	);
// }

// export function MyDraggable(props: { id: string, children: ReactNode }) {

// 	const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: props.id });

// 	return (
// 		<div
// 			ref={setNodeRef}
// 			{...listeners}
// 			{...attributes}
// 			className="bg-violet-300"
// 			style={
// 				transform
// 				? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
// 				: undefined
// 			}
// 		>
// 			{props.children}
// 		</div>
// 	);
// }

export default function TripPagePlan() {

	debugLogComponentRerender("TripPagePlan");

	const tripPageLayoutContext: TripPageLayoutContext = useTripPageLayoutContext();

	const tripName = tripPageLayoutContext.tripDbDoc.get("trip_name");

	const listOfDestinations: { [key: string]: any } = tripPageLayoutContext.tripDbDoc.get("destinations");

	// const containers = ['A', 'B', 'C'];
	// const [parent, setParent] = useState<string | null>(null);

	// function handleDragEnd(e: DragEndEvent) {
	// 	const { over } = e;

	// 	if (over !== null) {
	// 		setParent(over.id.toString());
	// 	} else {
	// 		setParent(null);
	// 	}
	// }

	// const myDraggableElem = (
	// 	<MyDraggable id="draggable">Drag Me</MyDraggable>
	// );

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

				{/* Insert Itinerary Here */}
				<Itinerary tripDbDoc={tripPageLayoutContext.tripDbDoc} listOfDestinations={listOfDestinations}/>

				{/* Insert Possible Stops Column Here */}
			</div>
		</div>
	);
}
