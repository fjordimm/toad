/*
 Description:
  The right side of the plan page; a list of destinations that aren't placed on a specific day in the itinerary yet.
 
 Interactions:
  - Parent Component(s): TripPagePlan
  - Direct Children Component(s): DestinationBox, AddDestination
  - Database: none
*/

import React from "react";
import type { DocumentSnapshot } from "firebase/firestore";
import { useState, type ReactNode } from "react";
import { DestinationDroppable, DraggableDestinationBox } from "~/components/pages/TripPagePlan";
import AddDestination from "./AddDestination";
import { debugLogComponentRerender } from "~/src/debugUtil";

export default function PossibleStops(props: { tripDbDoc: DocumentSnapshot, listOfDestinations: { [key: string]: any }, activeDraggableId: string | null }) {

    debugLogComponentRerender("PossibleStops");

    function turnUnusedDestinationsIntoElems(): ReactNode {

        const destinationsAsElems = [];
        for (const [key, val] of Object.entries(props.listOfDestinations)) {
            if (!val.is_in_itinerary) {
                destinationsAsElems.push(
                    <DraggableDestinationBox
                        tripDbDoc={props.tripDbDoc}
                        activeDraggableId={props.activeDraggableId}
                        destinationId={key}
                        destinationObj={val}
                    />
                );
            }
        }

        return (
            <div className="flex flex-col">
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
            <div className="grow max-w-full bg-itinerary_card_green rounded-lg flex flex-col items-center justify-start p-5 gap-5">
                <h1 className="text-center font-sunflower text-2xl text-sidebar_deep_green">Possible Stops</h1>
                <hr className="w-full border-sidebar_deep_green border-[1px]" />
                <div className="max-w-full min-w-full flex flex-col">
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
