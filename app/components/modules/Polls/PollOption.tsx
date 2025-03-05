
import { useTripPageLayoutContext, type TripPageLayoutContext } from "app/components/pages/TripPageLayout";
import { getDoc } from "firebase/firestore";
import { dbAddVote } from "~/src/databaseUtil";


interface PollOption{
    id: string,
    option: string,      // Option
    votes: string[],     // string[] array of user emails that voted for this option
}

export default function PollOption({option, votes, id}:PollOption){
    const tripPageLayoutContext: TripPageLayoutContext = useTripPageLayoutContext();

    // email of current logged-in user - the voter
    const voter = tripPageLayoutContext.userDbDoc.get("email");
    const userColor = tripPageLayoutContext.tripMembersInfo[voter].color;
    
    async function handleVoteCasted () {
        if (tripPageLayoutContext.tripDbDoc) {
            console.log("User votedwadad: "+ voter)

            await dbAddVote(tripPageLayoutContext.tripDbDoc.ref, id, option, voter);
        } 
    }
    
    return (
        <div className="flex gap-4 items-center">
            <div className="flex flex-col gap-1">
                <button 
                    className="w-96 bg-[#F8E14C] p-2 rounded-md text-left font-sunflower text-sidebar_deep_green font-bold"
                    onClick={() => handleVoteCasted()}
                >
                    {option} 
                </button>

                <div className="flex gap-1 min-h-4">
                {votes.map((user, index) => (
                    <div className={`w-[14px] h-[14px] rounded-full ${tripPageLayoutContext.tripMembersInfo[user].color}`}></div>
                ))}
                </div>
            </div>
            <h1 className="font-sunflower text-sidebar_deep_green"><b>30%</b></h1>
        </div>
    )
}