import { useTripPageLayoutContext, type TripMembersInfo, type TripPageLayoutContext } from "~/components/pages/TripPageLayout"
import PollOption from "./PollOption";
import { dbDeletePoll, dbDeleteVotes } from "~/src/databaseUtil";
import type { DocumentSnapshot } from "firebase/firestore";
import Loading from "../Loading";

// Properties of a Poll
interface PollData{
    pollID: string,
    description: string,
    options: string[],
    poll_owner: string,
    time_added: Number,
    title: string,
    votes: Record<string, string[]>
}

// Calculates total number of votes casted
// Param: map of votes{options, [list of voters]}
// Returns: number
function totalVotes (votes:Record<string, string[]>  ): number {
    let total = 0;
    for (const option in votes){
        total += votes[option].length
    }
    return total
}

// Displays one Poll
export default function PollCard ({pollID, description, options, poll_owner, title, votes}:PollData) {

    const tripPageLayoutContext: TripPageLayoutContext = useTripPageLayoutContext();
    
    //Get Full Name and Avatar Color of pollOwner
    const pollOwnerInfo = tripPageLayoutContext.tripMembersInfo?.[poll_owner];
    if (!pollOwnerInfo) {
        return <Loading />; // Loading poll owner
    }
    const userFullName = `${pollOwnerInfo.dbDoc.get("first_name")} ${pollOwnerInfo.dbDoc.get("last_name")}`;
    const userColor = pollOwnerInfo.color;

    //Get email of current voter
    const voter = tripPageLayoutContext.userDbDoc.get("email");


    // Deletes a Poll
    async function handleDeletePoll() {
        if (tripPageLayoutContext.tripDbDoc) {
            await dbDeletePoll(tripPageLayoutContext.tripDbDoc.ref, pollID);
        }
    }

    //Removes the current voter's vote
    async function handleClearVote() {
        if (tripPageLayoutContext.tripDbDoc) {
            await dbDeleteVotes(tripPageLayoutContext.tripDbDoc.ref, pollID, voter);
        }
    }


    return (
        <div className="flex gap-4 min-h-50 bg-[#EAFFB9] rounded-md p-4">

            {/* User Avatar */}
            <div className={`w-[28px] h-[28px] rounded-full ${userColor}`}></div>

            {/* Main Component */}
            <div className="flex flex-col gap-2 w-full">
                {/* Poll Title + Owner */}
                <h1 className="font-sunflower text-sidebar_deep_green text-lg"><b>{userFullName}:</b>    {title}</h1>
                
                {/* Poll Description */}
                <p className="font-sunflower text-sidebar_deep_green"> {description}</p>
                
                {/* Poll Options */}
                {options.map((item,index) =>{
                    return (
                        <div className="flex gap-4 items-center">
                            <PollOption id= {pollID} option={item} votes={votes[item]} totalVotes={totalVotes(votes)} />
                        </div>
                )})}

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