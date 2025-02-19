import React from "react";
import type { DocumentSnapshot } from "firebase/firestore";
import { Link } from "react-router";
import { indexTo15UniqueColor } from "~/src/miscUtil";

export default function TripsButton(props: { tripDbDoc: DocumentSnapshot, tripColorIndex: number }) {

    const color = indexTo15UniqueColor(props.tripColorIndex);

    const tripId: string = props.tripDbDoc.id;
    const tripName: string = props.tripDbDoc.get("trip_name");

    return (
        <div className="flex justify-center m-2">
            <Link to={`/trip/${tripId}`} className="flex items-center justify-between bg-sidebar_button_bg py-2 px-4 rounded-lg shadow-md w-4/5 max-w-xs">
                <span className="font-sunflower text-white">{tripName}</span>
                <div className={`relative rounded-full h-7 w-7 flex items-center justify-center ${color}`}></div>
            </Link>
        </div>
    )

}
