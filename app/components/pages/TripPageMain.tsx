import ToadCount from "../modules/ToadCount";
import NewPoll from "../modules/PollModal";
import { debugLogComponentRerender } from "~/src/debugUtil";
import { useTripPageLayoutContext, type TripPageLayoutContext } from "./TripPageLayout";
import React, { useState } from "react";
import { Link } from "react-router";
import AddPoll from "/AddPoll.svg";
import CalenderDate from "/calendar-date.svg";
import Dollar from "/currency-dollar-circle.svg"

export default function TripPageMain() {

    debugLogComponentRerender("TripPageMain");

    const tripPageLayoutContext: TripPageLayoutContext = useTripPageLayoutContext();

    const tripName: string = tripPageLayoutContext.tripDbDoc.get("trip_name");

    const [isPollModalOpen, setIsPollModalOpen] = useState(false);


    return (
        <div className="grow flex flex-row justify-between gap-5 bg-dashboard_lime">
            <div className="grow flex flex-col gap-5">
                <h1 className="bg-dashboard_component_bg rounded-lg p-5 text-sidebar_deep_green font-sunflower text-4xl w-9/12" style={{ fontWeight: 900 }}>{tripName}</h1>

                <div className="h-screen bg-[#D4F28F] w-9/12">
                    {/* Add a poll button */}
                    <div className="flex flex-col items-center m-4">
                        <button
                            onClick={() => setIsPollModalOpen(true)}
                            className="flex justify-center space-x-2"
                            aria-label="Add Poll"
                        >
                            <img src={AddPoll} alt="Add Poll" className="w-8 h-8" />
                            <h2 className="text-lg font-sunflower">Create A Poll</h2>
                        </button>

                        {/* List of all the polls */}
                        <div>
                            
                        </div>
                    </div>

                </div>
            </div>

            <div className="w-1/5 h-screen p-4 fixed right-0 top-0 flex flex-col items-center justify-start space-y-6">
                <ToadCount tripDbDoc={tripPageLayoutContext.tripDbDoc} tripMembersInfo={tripPageLayoutContext.tripMembersInfo} />

                <Link to="./plan" className="w-full flex justify-center">
                    <button className="w-10/12 h-40 bg-[#D4F28F] text-green-900 rounded-lg shadow-md p-4 flex flex-col items-center justify-center space-y-2">
                        <img src={CalenderDate} className="w-17 h-17" />
                        <h2 className="font-sunflower text-sidebar_deep_green text-2xl">Trip Itinerary</h2>
                    </button>
                </Link>

                <Link to="./budget" className="w-full flex justify-center">
                    <button className="w-10/12 h-40 bg-[#D4F28F] text-green-900 rounded-lg shadow-md p-4 flex flex-col items-center justify-center space-y-2">
                        <img src={Dollar} className="w-17 h-17" />
                        <h2 className="font-sunflower text-sidebar_deep_green text-2xl">Budget Tool</h2>
                    </button>
                </Link>
            </div>




            {/* Show the modal when isPollModalOpen is true */}
            {isPollModalOpen && <NewPoll onClose={() => setIsPollModalOpen(false)} />}
        </div>
    );
}
