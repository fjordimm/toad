import type { DocumentSnapshot } from "firebase/firestore";
import React, { useState } from "react";
import { Link } from "react-router";
import { retrieveTripDbDoc } from "~/src/databaseUtil";

// When you call this component, give 2 paramenteters: NameOfTrip and TripNumber
// Example: <TripButton name="Portland" num={0}></TripButton>
// OnClick not implemented



function TripsButton(props: { tripId: string, tripName: string, num: number }){

    const colors = ["#E4BF3B", "#B298BF", "#85CCCC", "#BD7B7B", "#97CA7B",
                    "#DA934C", "#8B618F", "#6BB0DD", "#A25656", "#A25656",
                    "#D66A38", "#624865", "#277893", "#501C1C", "#335735"];
    
    const color = colors[props.num % colors.length] || colors[0];

    return(
    <div className="flex justify-center">
      <Link to={`/trip/${props.tripId}`} className="flex items-center justify-between bg-sidebar_button_bg py-2 px-4 rounded-lg shadow-md w-4/5 max-w-xs">
        <span className="font-sunflower text-white">{props.tripName}</span>
        <div className="relative rounded-full h-7 w-7 flex items-center justify-center"
          style={{ backgroundColor: color }}>
        </div>
      </Link>
    </div>
    )

}
export default TripsButton