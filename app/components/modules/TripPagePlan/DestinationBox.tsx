/*
 Description:
  A card representing a single destination and all its info. This will be dragged between Itinerary and PossibleStops.
 
 Interactions:
  - Parent Component(s): TripPagePlan
  - Direct Children Component(s): none
  - Database: Firestore writes
*/

import React from "react";
import { useState } from "react";
import MovableIcon from "/MovableIcon.svg";
import NotCollapsed from "/NotCollapsed.svg";
import Collapsed from "/Collapsed.svg";
import EditBox from "/EditBox.svg";
import Cancel from "/Cancel.svg";
import type { DocumentSnapshot } from "firebase/firestore";
import { dbDeleteDestination, dbRemoveDestinationFromAllItineraryDays } from "~/src/databaseUtil";
import { debugLogComponentRerender } from "~/src/debugUtil";

export default function DestinationBox(props: { tripDbDoc: DocumentSnapshot, destinationId: string, name: string, price: string, length: string, time: string, description: string }) {

    debugLogComponentRerender("DestinationBox");

    const [isCollapsed, setIsCollapsed] = useState(true);
    // const [mouseIsOver, setMouseIsOver] = useState(false);

    async function handleDelete(destinationId: string) {
        await dbRemoveDestinationFromAllItineraryDays(props.tripDbDoc.ref, destinationId);
        await dbDeleteDestination(props.tripDbDoc.ref, destinationId);
    }

    return (
        <div className="max-w-full bg-[#EAFFB9] rounded-lg shadow-sm p-3 flex flex-col items-stretch">
            {/* Top Section - Flex for responsive layout */}
            <div className="max-w-full flex flex-row items-center justify-between">
                {/* Left Side - Movable Icon & Name */}
                <div className="max-w-full min-w-0 flex flex-row items-center overflow-hidden">
                    <img src={MovableIcon} alt="Movable Icon" className="w-6 h-6 mr-1" />
                    {/*Destination name here*/}
                    <span className="max-w-full min-w-0 text-black font-sunflower font-bold overflow-hidden overflow-ellipsis whitespace-nowrap mt-1 mx-3">{props.name}</span>
                </div>

                {/* Right Side - Buttons */}

                <div className="flex flex-row justify-end gap-1" onPointerDown={(e) => e.stopPropagation()}>
                    {/* Edit Button */}
                    {/* <button className="w-6 h-6" aria-label="Edit destination">
                        <img src={EditBox} alt="Edit Box" />
                    </button> */}

                    {/*Trash Button*/}
                    <button onClick={() => handleDelete(props.destinationId)} className="w-6 h-6" aria-label="Delete destination">
                        <img src={Cancel} alt="Delete" />
                    </button>

                    {/* Collapse Button */}
                    <button onClick={() => setIsCollapsed(!isCollapsed)} className="w-6 h-6" aria-label="Toggle details">
                        <img src={isCollapsed ? Collapsed : NotCollapsed} alt="Toggle Icon" />
                    </button>
                </div>
            </div>

            {/*tags for cost, duration, and time below these elements*/}
            <div className="flex space-x-2 mt-2 ml-1">
                {/*cost*/}
                <div className="bg-[#B0E5DF] text-black font-sunflower font-bold px-2 py-1 rounded-lg text-[12px] shadow-sm">{props.price}</div>
                {/*duration*/}
                <div className="bg-[#B0E5DF] text-black font-sunflower font-bold px-2 py-1 rounded-lg text-[12px] shadow-sm">{props.length}</div>
                {/*time*/}
                <div className="bg-[#B0E5DF] text-black font-sunflower font-bold px-2 py-1 rounded-lg text-[12px] shadow-sm">{props.time}</div>
            </div>

            {/* Collapsible Section */}
            <div
                className={`bg-[#D7F297] rounded-md text-sm text-black overflow-y-auto scrollbar-none break-words hyphens-auto transition-all duration-300 ease-in-out ${isCollapsed ? "max-h-0 opacity-0" : "max-h-[86px] opacity-100 px-2 mt-2 pt-1 pb-2"
                    }`}
            >
                {/* Activity Description */}
                <span className="text-black font-sunflower font-bold text-[11px]">Activity Description:</span>
                {/*Put Activity Description here */}
                <p className="text-black font-sunflower text-[10px]">{props.description}</p>
            </div>

        </div>
    );
}
