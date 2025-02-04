import React, { useState } from "react";
import MovableIcon from "/MovableIcon.svg";
import NotCollapsed from "/NotCollapsed.svg";
import Collapsed from "/Collapsed.svg";
import EditBox from "/EditBox.svg";
import { dbRetrieveTrip } from "~/src/databaseUtil";

export default function DestinationBox({ name = "Voodoo Donuts", details = "Some additional info. i love pizza. it is the best thing in the whole world. i love cheese pizza. peperroni pizza. all pizzas really. it's just so good. i wish everyone enjoys pizza like I do" }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="w-full max-w-[260px] bg-[#EAFFB9] rounded-lg shadow-sm p-3 flex flex-col">
            {/* Top Section - Flex for responsive layout */}
            <div className="flex items-center justify-between">
                {/* Left Side - Movable Icon & Name */}
                <div className="flex items-center ml-[-8px]">
                    <img src={MovableIcon} alt="Movable Icon" className="w-6 h-6 mr-1" />
                    <span className="text-black font-sunflower font-bold">{name}</span>
                </div>

                {/* Right Side - Buttons */}
                <div className="flex space-x-2">
                    {/* Edit Button */}
                    <button className="w-6 h-6" aria-label="Edit destination">
                        <img src={EditBox} alt="Edit Box" />
                    </button>

                    {/* Collapse Button */}
                    <button onClick={() => setIsCollapsed(!isCollapsed)} className="w-6 h-6" aria-label="Toggle details">
                        <img src={isCollapsed ? Collapsed : NotCollapsed} alt="Toggle Icon" />
                    </button>
                </div>
            </div>

            {/*tags for cost, duration, and time below this elements*/}
            <div className="flex space-x-2 mt-2 ml-3">
                <div className="bg-[#B0E5DF] text-black font-sunflower font-bold px-2 py-1 rounded-lg text-sm shadow-sm">$5</div>
                <div className="bg-[#B0E5DF] text-black font-sunflower font-bold px-2 py-1 rounded-lg text-sm shadow-sm">1 Hr</div>
                <div className="bg-[#B0E5DF] text-black font-sunflower font-bold px-2 py-1 rounded-lg text-sm shadow-sm">1:00 - 2:00 PM</div>
            </div>

            {/* Collapsible Section */}
            {!isCollapsed && (
                <div className="mt-2 px-2 pt-1 pb-2 bg-[#D7F297] rounded-md text-sm text-black w-[226px] h-[89px] overflow-y-auto scrollbar-none break-words hyphens-auto">
                    <span className="text-black font-sunflower font-bold text-[11px]">Activity Description:</span>
                    <p className="text-black font-sunflower text-[10px]">{details}</p>
                </div>
            )}
        </div>
    );
}
