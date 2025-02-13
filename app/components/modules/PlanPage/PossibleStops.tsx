import type { DocumentSnapshot } from "firebase/firestore";
import type { ReactNode } from "react";
import { DestinationDraggable, DestinationDroppable } from "~/components/pages/TripPagePlan";
import DestinationBox from "./DestinationBox";

export default function PossibleStops(props: { tripDbDoc: DocumentSnapshot, listOfDestinations: { [key: string]: any } }) {
	
	function turnUnusedDestinationsIntoElems(): ReactNode {

		const destinationsAsElems = [];
		for (const [key, val] of Object.entries(props.listOfDestinations)) {
			if (!val.is_in_itinerary) {
				destinationsAsElems.push(
					<DestinationDraggable id={key}>
						<DestinationBox name={val.name} cost={val.cost} duration={val.time} time={"todo"} details={"todo"}/>
					</DestinationDraggable>
				);
			}
		}

		return (
			<div className="flex flex-col w-full gap-2">
				{
					destinationsAsElems.map((elem: ReactNode) => {
						return elem;
					})
				}
			</div>
		);
	}
	
	return (
		<DestinationDroppable id="possiblestops">
			<div className="bg-pink-300 p-5 w-full grow">
				{turnUnusedDestinationsIntoElems()}
			</div>
		</DestinationDroppable>
	);
}
