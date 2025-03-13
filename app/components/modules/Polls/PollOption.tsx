/*
 Description:
  A button/display representing on of the options within a poll. You click this button to vote for this option.
 
 Interactions:
  - Parent Component(s): PollDisplay
  - Direct Children Component(s): none
  - Database: Firestore writes
*/

import React from "react";
import { useTripPageLayoutContext, type TripMembersInfo, type TripPageLayoutContext } from "app/components/pages/TripPageLayout";
import { DocumentSnapshot, getDoc } from "firebase/firestore";
import { dbAddVote } from "~/src/databaseUtil";
import Loading from "../Loading";
import { debugLogComponentRerender } from "~/src/debugUtil";

// Includes yellow option box and percentage
export default function PollOption(props: { id: string, option: string, votes: string[], totalVotes: number, tripDbDoc: DocumentSnapshot, tripMembersInfo: TripMembersInfo, voterDbDoc: DocumentSnapshot }) {

    debugLogComponentRerender("PollOption");

    // email of current logged-in user - the voter
    const voter = props.voterDbDoc.get("email");

    // Adds user to database for corresponding vote once they click on an option
    async function handleVoteCasted() {
        if (props.tripDbDoc) {
            console.log("User votedwadad: " + voter)

            await dbAddVote(props.tripDbDoc.ref, props.id, props.option, voter);
        }
    }

    // Ratio of:     voters who voted for this option / total voters
    // NaN values return 0
    const voterPercentage = isNaN((props.votes.length / props.totalVotes) * 100) ? 0 : Math.round((props.votes.length / props.totalVotes) * 100);

    // Math.round((Number(totalCost) / Object.keys(payees).length) * 100) / 100
    return (
        <div className="flex gap-4 w-full ">
            {/* Voter Percentage */}
            <h1 className="mt-2 w-8 font-sunflower text-sidebar_deep_green"><b>{voterPercentage}%</b></h1>


            {/* Wraps 'Option' and list of voter avatars */}
            <div className="flex flex-col gap-1 w-full">
                {/* Option Bar */}
                <button className="relative"
                    onClick={() => handleVoteCasted()}>
                    {/* Progress Bar Overlay - deep orange*/}
                    <div className="absolute h-full rounded-md bg-[#E29F2C] text-left font-sunflower text-sidebar_deep_green p-2 font-bold"
                        style={{ width: `${voterPercentage}%` }}>
                        <div className="whitespace-nowrap pl-4 overflow-x-visible">{props.option}</div>
                    </div>

                    {/* Vote Option Background - yellow */}
                    <div
                        className=" w-full h-10 bg-[#F8E14C] p-2 rounded-md text-left font-sunflower text-sidebar_deep_green font-bold"
                    // onClick={() => handleVoteCasted()}
                    >
                    </div>
                </button>


                {/* Display voters' avatars */}
                <div className="flex gap-1 min-h-4">
                    {props.votes.map((user, index) => {
                        if (props.tripMembersInfo[user] !== null && props.tripMembersInfo[user] !== undefined) {
                            return <div className={`w-[14px] h-[14px] rounded-full ${props.tripMembersInfo[user].color}`}></div>;
                        } else {
                            return <Loading />;
                        }
                    })}
                </div>
            </div>
        </div>
    );
}