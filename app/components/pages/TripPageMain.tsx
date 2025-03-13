/*
 Description:
  The page (with url '/trip/:tripId/') representing a single trip. You get to this page when clicking on a trip in the menu bar.
  It contains a feed of polls, ToadCount, and navigation buttons to the plan and the budget pages.
 
 Interactions:
  - Parent Component(s): TripPageLayout (as Outlet)
  - Direct Children Component(s): ToadCount, PollModal, PollDisplay
  - Database: none
*/

import React, { useState } from "react";
import ToadCount from "../modules/ToadCount";
import PollModal from "../modules/Polls/PollModal";
import { debugLogComponentRerender } from "~/src/debugUtil";
import { useTripPageLayoutContext, type TripPageLayoutContext } from "./TripPageLayout";
import { Link } from "react-router";
import AddPoll from "/AddPoll.svg";
import PollDisplay from "../modules/Polls/PollDisplay";
import CalenderDate from "/calendar-date.svg";
import Dollar from "/currency-dollar-circle.svg"

export default function TripPageMain() {

    debugLogComponentRerender("TripPageMain");

    const tripPageLayoutContext: TripPageLayoutContext = useTripPageLayoutContext();
    const currUser: string = tripPageLayoutContext.userDbDoc.get("email");

    if (!(tripPageLayoutContext.tripDbDoc.get("trip_active_users").includes(currUser))) {
        return (
            <div className="flex w-full align-middle justify-center items-center font-sunflower text-4xl text-sidebar_deep_green">
                <text>Forbidden! You are not a part of this trip.</text>
            </div>
        );
    }

    const tripName: string = tripPageLayoutContext.tripDbDoc.get("trip_name");

    // Converts Map of 'Polls' into an Array sorted by time_added
    const tripPolls: { [key: string]: any } = tripPageLayoutContext.tripDbDoc.get("polls");
    const tripPollsSorted = tripPolls && Object.keys(tripPolls).length > 0
        ? Object.entries(tripPolls).sort((a, b) => a[1].time_added - b[1].time_added)
        : [];


    const [isPollModalOpen, setIsPollModalOpen] = useState(false);


    return (
        <div className="w-full flex flex-row justify-between gap-5 bg-dashboard_lime">
            <div className="grow flex flex-col gap-5 overflow-x-hidden">
                <div className="bg-dashboard_component_bg rounded-lg p-5 text-sidebar_deep_green font-sunflower text-4xl" style={{ fontWeight: 900 }}>
                    <h1 className="overflow-hidden overflow-ellipsis">{tripName}</h1>
                </div>

                <div className="h-full overflow-auto rounded-xl p-4 bg-[#D4F28F] flex flex-col items-center gap-4">
                    <button
                        onClick={() => setIsPollModalOpen(true)}
                        className="flex items-center space-x-2 p-2"
                        aria-label="Add Poll"
                    >
                        <img src={AddPoll} alt="Add Poll" className="w-8 h-8" />
                        <h2 className="text-lg font-sunflower">Create A Poll</h2>
                    </button>

                    <div className="w-full flex flex-col gap-2 overflow-auto">
                        {tripPollsSorted.map(([pollID, poll]) => (
                            <PollDisplay
                                pollID={pollID || " "}
                                description={poll.description || " "}
                                options={poll.options || []}
                                poll_owner={poll.poll_owner || " "}
                                time_added={poll.time_added || 0}
                                title={poll.title || " "}
                                votes={poll.votes || []}
                                tripDbDoc={tripPageLayoutContext.tripDbDoc}
                                tripMembersInfo={tripPageLayoutContext.tripMembersInfo}
                                voterDbDoc={tripPageLayoutContext.userDbDoc}
                            />
                        ))}

                    </div>
                </div>

            </div>

            <div className="flex flex-col items-center justify-start gap-3">
                <ToadCount tripDbDoc={tripPageLayoutContext.tripDbDoc} tripMembersInfo={tripPageLayoutContext.tripMembersInfo} />

                <Link to="./plan" className="w-full flex justify-center">
                    <button className="w-full bg-[#D4F28F] text-green-900 rounded-lg shadow-lg p-4 flex flex-col items-center justify-center space-y-2">
                        <img src={CalenderDate} className="w-12 h-12" />
                        <h2 className="font-sunflower text-sidebar_deep_green text-2xl">Trip Itinerary</h2>
                    </button>
                </Link>

                <Link to="./budget" className="w-full flex justify-center">
                    <button className="w-full bg-[#D4F28F] text-green-900 rounded-lg shadow-lg p-4 flex flex-col items-center justify-center space-y-2">
                        <img src={Dollar} className="w-12 h-12" />
                        <h2 className="font-sunflower text-sidebar_deep_green text-2xl">Budget Tool</h2>
                    </button>
                </Link>
            </div>

            {/* Show the modal when isPollModalOpen is true */}
            {isPollModalOpen && <PollModal onClose={() => setIsPollModalOpen(false)} />}
        </div>
    );
}
