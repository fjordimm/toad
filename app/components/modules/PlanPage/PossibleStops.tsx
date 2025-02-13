import type { DocumentSnapshot } from "firebase/firestore";
import { useState, type ReactNode } from "react";
import { DestinationDraggable, DestinationDroppable } from "~/components/pages/TripPagePlan";
import DestinationBox from "./DestinationBox";
import AddDestination from "./AddDestination";

export default function PossibleStops(props: { tripDbDoc: DocumentSnapshot, listOfDestinations: { [key: string]: any } }) {
	
	function turnUnusedDestinationsIntoElems(): ReactNode {

		const destinationsAsElems = [];
		for (const [key, val] of Object.entries(props.listOfDestinations)) {
			if (!val.is_in_itinerary) {
				destinationsAsElems.push(
					<DestinationDraggable id={key}>
						<DestinationBox tripDbDoc={props.tripDbDoc} destinationId={key} name={val.name} price={val.price} length={val.length} time={val.time} description={val.description} />
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

	const [isModalOpen, setIsModalOpen] = useState(false);
	
	return (
		<DestinationDroppable id="possiblestops">
			<div className="w-full bg-itinerary_card_green rounded-lg flex flex-col items-center justify-start p-5 gap-5">
				<h1 className="text-center font-sunflower text-2xl text-sidebar_deep_green">Possible Stops</h1>
				<hr className="w-full border-sidebar_deep_green border-[1px]" />
				<div className="w-full bg-pink-300 p-1">
					{turnUnusedDestinationsIntoElems()}
				</div>
				<button onClick={() => setIsModalOpen(true)} className="relative rounded-full h-7 w-7 flex items-center justify-center bg-[#4E6A55] text-white">+</button>
			</div>

			{
				isModalOpen
				? <AddDestination tripDbDoc={props.tripDbDoc} onClose={() => setIsModalOpen(false)} />
				: null
			}
		</DestinationDroppable>
	);
}
