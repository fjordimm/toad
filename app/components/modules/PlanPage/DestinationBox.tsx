{/*Takes in 5 prop arguments: Destination name, cost, duration, time, and activity description
    I put comments where these arguments will be called. */}

import React from "react";
import { useState } from "react";
import MovableIcon from "/MovableIcon.svg";
import NotCollapsed from "/NotCollapsed.svg";
import Collapsed from "/Collapsed.svg";
import EditBox from "/EditBox.svg";
import Cancel from "/Cancel.svg";
import type { DocumentSnapshot } from "firebase/firestore";
import { dbDeleteDestination, dbRemoveDestinationFromAllItineraryDays } from "~/src/databaseUtil";

{/*take in a prop argument is a dictionary that looks like tree structure*/ }
export default function DestinationBox(props: { tripDbDoc: DocumentSnapshot, destinationId: string, name: string, price: string, length: string, time: string, description: string }) {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [mouseIsOver, setMouseIsOver] = useState(false);

    async function handleDelete(destinationId: string) {
        await dbRemoveDestinationFromAllItineraryDays(props.tripDbDoc.ref, destinationId);
        await dbDeleteDestination(props.tripDbDoc.ref, destinationId);
    }

    return (
        <div className="w-full max-w-96 bg-[#EAFFB9] rounded-lg shadow-sm p-3 flex flex-col">
            {/* Top Section - Flex for responsive layout */}
            <div className="flex items-center justify-between">
                {/* Left Side - Movable Icon & Name */}
                <div className="flex items-center ml-[-10px] flex-1 overflow-hidden">
                    <img src={MovableIcon} alt="Movable Icon" className="w-6 h-6 mr-1" />
                    {/*Destination name here*/}
                    <span className="text-black font-sunflower font-bold overflow-hidden text-ellipsis whitespace-nowrap max-w-[145px] mt-1">{props.name}</span>
                </div>

                {/* Right Side - Buttons */}

                <div className="flex flex-wrap justify-end gap-1" onPointerDown={(e) => e.stopPropagation()}>
                    {/* Edit Button */}
                    <button className="w-6 h-6" aria-label="Edit destination">
                        <img src={EditBox} alt="Edit Box" />
                    </button>

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
                className={`bg-[#D7F297] rounded-md text-sm text-black max-w-[256px] overflow-y-auto scrollbar-none break-words hyphens-auto transition-all duration-300 ease-in-out ${isCollapsed ? "max-h-0 opacity-0" : "max-h-[86px] opacity-100 px-2 mt-2 pt-1 pb-2"
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
