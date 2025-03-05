import ToadCount from "../modules/ToadCount";
import NewPoll from "../modules/Polls/PollModal";
import { debugLogComponentRerender } from "~/src/debugUtil";
import { useTripPageLayoutContext, type TripPageLayoutContext } from "./TripPageLayout";
import React, { useState } from "react";
import { Link } from "react-router";
import AddPoll from "/AddPoll.svg";
import PollCard from "../modules/Polls/PollDisplay";

interface PollData{
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

    const tripName: string = tripPageLayoutContext.tripDbDoc.get("trip_name");

    // Converts Map of 'Polls' into an Array sorted by time_added
    const tripPolls: Map<string,PollData>  = tripPageLayoutContext.tripDbDoc.get('polls');
    const tripPollsSorted  = Object.entries(tripPolls).sort((a,b) => a[1].time_added - b[1].time_added );




    const [isPollModalOpen, setIsPollModalOpen] = useState(false);


    return (
        <div className="grow flex flex-row justify-between gap-5 bg-dashboard_lime">
            <div className="grow flex flex-col gap-5">
                <h1 className="bg-dashboard_component_bg rounded-lg p-5 text-sidebar_deep_green font-sunflower text-4xl" style={{ fontWeight: 900 }}>{tripName}</h1>

                {/* <div className="">
                    <Link to="./plan" className="bg-dashboard_component_bg py-2 px-4 rounded-lg font-sunflower text-sidebar_deep_green underline">Plan</Link>
                </div>
                <div className="">
                    <Link to="./budget" className="bg-dashboard_component_bg py-2 px-4 rounded-lg font-sunflower text-sidebar_deep_green underline">Budget</Link>
                </div> */}

                <div className="h-full overflow-scroll rounded-lg p-4 bg-[#D4F28F] flex flex-col items-center gap-4">
                    <button
                        onClick={() => setIsPollModalOpen(true)}
                        className="flex items-center gap-2"
                        aria-label="Add Poll"
                    >
                            <img src={AddPoll} alt="Add Poll"/>
                            <p className="font-sunflower text-sidebar_deep_green text-xl font-bold">Create a Poll</p>
                    </button>

                    <div className="w-full flex flex-col gap-2 overflow-scroll">
                        {tripPollsSorted.map(([pollID, poll]) =>(
                            <PollCard 
                                tripMembersInfo={tripPageLayoutContext.tripMembersInfo}
                                description={poll.description}
                                options={poll.options}
                                poll_owner={poll.poll_owner}
                                time_added={poll.time_added}
                                title={poll.title}
                                votes={poll.votes}
                            />
                        ))}
                       
                    </div>


                    
                </div>
                
            </div>

            <ToadCount tripDbDoc={tripPageLayoutContext.tripDbDoc} tripMembersInfo={tripPageLayoutContext.tripMembersInfo} />

            {/* Show the modal when isPollModalOpen is true */}
            {isPollModalOpen && <NewPoll onClose={() => setIsPollModalOpen(false)} />}
        </div>
    );
}
