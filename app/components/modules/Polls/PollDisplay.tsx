/*
 Description:
  A card representing a single poll on the poll section of a trip's main page.
 
 Interactions:
  - Parent Component(s): TripPageMain
  - Direct Children Component(s): PollOption
  - Database: none
*/

import { useTripPageLayoutContext, type TripMembersInfo, type TripPageLayoutContext } from "~/components/pages/TripPageLayout"
import PollOption from "./PollOption";
import { dbDeletePoll, dbDeleteVotes } from "~/src/databaseUtil";
import type { DocumentSnapshot } from "firebase/firestore";
import Loading from "../Loading";
import { debugLogComponentRerender } from "~/src/debugUtil";

// Calculates total number of votes casted
// Param: map of votes{options, [list of voters]}
// Returns: number
function totalVotes(votes: Record<string, string[]>): number {
    let total = 0;
    for (const option in votes) {
        total += votes[option].length
    }
    return total
}

// Displays one Poll
export default function PollDisplay(props: { pollID: string, description: string, options: string[], poll_owner: string, time_added: Number, title: string, votes: Record<string, string[]>, tripDbDoc: DocumentSnapshot, tripMembersInfo: TripMembersInfo, voterDbDoc: DocumentSnapshot }) {

    debugLogComponentRerender("PollDisplay");

    //Get Full Name and Avatar Color of pollOwner
    const pollOwnerInfo = props.tripMembersInfo?.[props.poll_owner];
    if (!pollOwnerInfo) {
        return <Loading />; // Loading poll owner
    }
    const userFullName = `${pollOwnerInfo.dbDoc.get("first_name")} ${pollOwnerInfo.dbDoc.get("last_name")}`;
    const userColor = pollOwnerInfo.color;

    //Get email of current voter
    const voter = props.voterDbDoc.get("email");

    // Deletes a Poll
    async function handleDeletePoll() {
        if (props.tripDbDoc) {
            await dbDeletePoll(props.tripDbDoc.ref, props.pollID);
        }
    }

    //Removes the current voter's vote
    async function handleClearVote() {
        if (props.tripDbDoc) {
            await dbDeleteVotes(props.tripDbDoc.ref, props.pollID, voter);
        }
    }

    return (
        <div className="flex gap-4 min-h-50 bg-[#EAFFB9] rounded-md p-4">

            {/* User Avatar */}
            <div className={`w-[28px] h-[28px] rounded-full ${userColor}`}></div>

            {/* Main Component */}
            <div className="flex flex-col gap-2 w-full">
                {/* Poll Title + Owner */}
                <h1 className="font-sunflower text-sidebar_deep_green text-lg"><b>{userFullName}:</b>    {props.title}</h1>

                {/* Poll Description */}
                <p className="font-sunflower text-sidebar_deep_green"> {props.description}</p>

                {/* Poll Options */}
                {props.options.map((item, index) => {
                    return (
                        <div className="flex gap-4 items-center">
                            <PollOption
                                id={props.pollID}
                                option={item}
                                votes={props.votes[item]}
                                totalVotes={totalVotes(props.votes)}
                                tripDbDoc={props.tripDbDoc}
                                tripMembersInfo={props.tripMembersInfo}
                                voterDbDoc={props.voterDbDoc}
                            />
                        </div>
                    )
                })}

                {/* Bottom Right Buttons */}
                <div className="flex w-full gap-2 justify-end ">
                    <button
                        className="self-end bg-[#CFC0E5] text-center p-1 rounded-md font-sunflower text-sidebar_deep_green w-24"
                        onClick={handleClearVote}
                    >Clear Vote</button>

                    <button
                        className="self-end bg-[#F9B691] text-center p-1 rounded-md font-sunflower text-sidebar_deep_green w-24"
                        onClick={handleDeletePoll}
                    >Delete Poll</button>
                </div>
            </div>
        </div>
    )
}