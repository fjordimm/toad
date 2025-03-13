/*
 Description:
  A modal that asks to confirm if they want to delete a trip, so that they don't delete one on accident.
 
 Interactions:
  - Parent Component(s): ToadCount
  - Direct Children Component(s): none
  - Database: none
*/

import React from "react";
import { dbDeleteTrip } from "~/src/databaseUtil";
import type { DocumentSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router";
import { debugLogComponentRerender, debugLogError } from "~/src/debugUtil";
import { useRef } from "react";

export default function ConfirmDelete(props: { tripDbDoc: DocumentSnapshot | null, onClose: () => void }) {

    debugLogComponentRerender("ConfirmDelete");

    const navigate = useNavigate();
    const modalContentRef = useRef<HTMLDivElement>(null);
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
            props.onClose();
        }
    };


    async function handleDeleteTrip() {

        if (props.tripDbDoc !== null) {
            await dbDeleteTrip(props.tripDbDoc);
            navigate("/");
        } else {
            debugLogError("Trying to delete an invalid trip.");
        }
    }

    return (
        <div
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
            onClick={handleOverlayClick}
        >
            {/* Modal content container */}
            <div
                ref={modalContentRef}
                className="relative flex flex-col justify-center items-center bg-dashboard_component_bg py-8 rounded-2xl p-6 gap-6"
                // Stop click events from bubbling to the overlay
                onClick={(e) => e.stopPropagation()}>

                <div className="flex flex-col font-sunflower text-sidebar_deep_green">
                    <p>Are you sure you want to delete trip? This action is irreversible. </p>
                    <div className="flex flex-row justify-center p-3 gap-6">
                        <button onClick={() => props.onClose()} className="flex w-1/3 bg-sidebar_button_bg/50 text-white rounded-lg text-sm hover:bg-sidebar_button_bg/70 justify-center align-middle text-center p-3">
                            No, go back!
                        </button>
                        <button onClick={handleDeleteTrip} className="flex w-1/3 bg-[#D86D6D]/50 text-white rounded-lg text-sm hover:bg-[#D86D6D]/70 items-center justify-center align-middle text-center p-3">
                            Delete Trip
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}