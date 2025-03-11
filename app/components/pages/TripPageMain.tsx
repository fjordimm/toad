/*
 * File Description: This page is the main trip page, or the first thing a user sees when the click on a trip from the sidebar.
 *                   It contains a feed of polls, navigation buttons to the plan/budget page, a view of the members of the trip
 * File Interactions: This page interacts with ToadCount.tsx, PollModal.tsx, PollCard.tsx, and navigates to the budget/trip pages
 */

import ToadCount from "../modules/ToadCount";
import NewPoll from "../modules/Polls/PollModal";
import { debugLogComponentRerender } from "~/src/debugUtil";
import { useTripPageLayoutContext, type TripPageLayoutContext } from "./TripPageLayout";
import React, { useState } from "react";
import { Link } from "react-router";
import AddPoll from "/AddPoll.svg";
import PollCard from "../modules/Polls/PollDisplay";
import CalenderDate from "/calendar-date.svg";
import Dollar from "/currency-dollar-circle.svg"

interface PollData {
    description: string,
    options: string[],
    poll_owner: string,
    time_added: Number,
    title: string,
    votes: Record<string, string[]>,
}


export default function TripPageMain() {

    debugLogComponentRerender("TripPageMain");

    const tripPageLayoutContext: TripPageLayoutContext = useTripPageLayoutContext();
    const currUser: string = tripPageLayoutContext.userDbDoc.get("email");

    if(!(tripPageLayoutContext.tripDbDoc.get("trip_active_users").includes(currUser))) {
        return(
            <div className="flex w-full align-middle justify-center items-center font-sunflower text-4xl text-sidebar_deep_green">
                <text>Forbidden! You are not a part of this trip.</text>
            </div>
        );
    }

    const tripName: string = tripPageLayoutContext.tripDbDoc.get("trip_name");

    // Converts Map of 'Polls' into an Array sorted by time_added
    const tripPolls: Map<string, PollData> = tripPageLayoutContext.tripDbDoc.get('polls');
    const tripPollsSorted = tripPolls && Object.keys(tripPolls).length > 0
        ? Object.entries(tripPolls).sort((a, b) => a[1].time_added - b[1].time_added)
        : [];


    const [isPollModalOpen, setIsPollModalOpen] = useState(false);


    return (
        <div className="grow flex flex-row justify-between gap-5 bg-dashboard_lime">
            <div className="grow flex flex-col gap-5">
                <h1 className="bg-dashboard_component_bg rounded-lg p-5 text-sidebar_deep_green font-sunflower text-4xl w-9/12" style={{ fontWeight: 900 }}>{tripName}</h1>

                {/* <div className="">
                    <Link to="./plan" className="bg-dashboard_component_bg py-2 px-4 rounded-lg font-sunflower text-sidebar_deep_green underline">Plan</Link>
                </div>
                <div className="">
                    <Link to="./budget" className="bg-dashboard_component_bg py-2 px-4 rounded-lg font-sunflower text-sidebar_deep_green underline">Budget</Link>
                </div> */}

                <div className="h-full w-9/12 overflow-scroll rounded-xl p-4 bg-[#D4F28F] flex flex-col items-center gap-4">
                    <button
                        onClick={() => setIsPollModalOpen(true)}
                        className="flex items-center space-x-2 p-2"
                        aria-label="Add Poll"
                    >
                        <img src={AddPoll} alt="Add Poll" className="w-8 h-8" />
                        <h2 className="text-lg font-sunflower">Create A Poll</h2>
                    </button>

                    <div className="w-full flex flex-col gap-2 overflow-scroll">
                        {tripPollsSorted.map(([pollID, poll]) => (
                            <PollCard
                                pollID={pollID || " "}
                                description={poll.description || " "}
                                options={poll.options || []}
                                poll_owner={poll.poll_owner || " "}
                                time_added={poll.time_added || 0}
                                title={poll.title || " "}
                                votes={poll.votes || []}
                            />
                        ))}

                    </div>
                </div>

            </div>

            <div className="w-1/5 h-screen p-4 fixed right-0 top-0 flex flex-col items-center justify-start space-y-6">
                <ToadCount tripDbDoc={tripPageLayoutContext.tripDbDoc} tripMembersInfo={tripPageLayoutContext.tripMembersInfo} />

                <Link to="./plan" className="w-full flex justify-center">
                    <button className="w-full h-40 bg-[#D4F28F] text-green-900 rounded-lg shadow-lg p-4 flex flex-col items-center justify-center space-y-2">
                        <img src={CalenderDate} className="w-17 h-17" />
                        <h2 className="font-sunflower text-sidebar_deep_green text-2xl">Trip Itinerary</h2>
                    </button>
                </Link>

                <Link to="./budget" className="w-full flex justify-center">
                    <button className="w-full h-40 bg-[#D4F28F] text-green-900 rounded-lg shadow-lg p-4 flex flex-col items-center justify-center space-y-2">
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
