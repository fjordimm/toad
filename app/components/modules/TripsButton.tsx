import exp from "constants";
import { SocketAddress } from "net";
import React from "react";

// When you call this component, give 2 paramenteters: NameOfTrip and TripNumber
// Example: <TripButton name="Portland" num={0}></TripButton>


function TripsButton(props){

    const colors = ["#E4BF3B", "#B298BF", "#85CCCC", "#BD7B7B", "#97CA7B",
                    "#DA934C", "#8B618F", "#6BB0DD", "#A25656", "#A25656",
                    "#D66A38", "#624865", "#277893", "#501C1C", "#335735"];
    
    const color = colors[props.num % colors.length] || colors[0];
    console.log(color)

    return(
    <div className="flex justify-center my-4">
      <button className="flex items-center justify-between bg-sidebar_button_bg py-2 px-4 rounded-lg shadow-md w-4/5 max-w-xs">
        <span className="font-sunflower text-white">{props.name|| "New Trip"}</span>
        <div className="relative rounded-full h-7 w-7 flex items-center justify-center"
          style={{ backgroundColor: color }}>
        </div>
      </button>
    </div>
    )

}
export default TripsButton