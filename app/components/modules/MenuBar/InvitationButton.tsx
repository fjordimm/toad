import type { DocumentSnapshot } from "firebase/firestore";
import React from "react";
import { dbAcceptInvitation, dbDeclineInvitation } from "~/src/databaseUtil";
import { debugLogComponentRerender } from "~/src/debugUtil";

// When you call this component, give 2 paramenteters: NameOfTrip and TripNumber
// Example: <TripButton name="Portland" num={0}></TripButton>
// OnClick not implemented



function InvitationButton(props: { userDbDoc: DocumentSnapshot, tripDbDoc: DocumentSnapshot }) {

    debugLogComponentRerender("InvitationButton");

    async function handleCheckButton() {
        await dbAcceptInvitation(props.userDbDoc, props.tripDbDoc.id);
    }

    async function handleCrossButton() {
        await dbDeclineInvitation(props.userDbDoc, props.tripDbDoc.id);
    }

    return (
        <div className="flex justify-center my-4">
            <div className="flex items-center justify-between bg-sidebar_button_bg py-2 px-4 rounded-lg shadow-md w-4/5 max-w-xs">
                <span className="font-sunflower text-white">{props.tripDbDoc.get("trip_name") || "New Trip"}</span>
                <div className="flex items-center space-x-4">
                    {/* Check Button */}
                    <button onClick={handleCheckButton} className="relative bg-[#6EBA5D] rounded-full h-8 w-8 flex items-center justify-center shadow-sm">
                        <span className="absolute inset-0 rounded-full bg-[#6EBA5D] opacity-75"></span>
                        <span className="relative text-white text-lg font-bold">&#x2713;</span>
                    </button>

                    {/* Cross Button */}
                    <button onClick={handleCrossButton} className="relative bg-[#D86D6D] rounded-full h-8 w-8 flex items-center justify-center shadow-sm">
                        <span className="absolute rounded-full inset-0 bg-[#D86D6D] opacity-75"></span>
                        <span className="relative text-white text-lg font-bold">&#1061;</span>
                    </button>
                </div>
            </div>
        </div>
    )

}
export default InvitationButton