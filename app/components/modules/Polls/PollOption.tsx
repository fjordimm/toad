
import { useTripPageLayoutContext, type TripPageLayoutContext } from "app/components/pages/TripPageLayout";
import { getDoc } from "firebase/firestore";
import { dbAddVote } from "~/src/databaseUtil";


interface PollOption{
    id: string,
    option: string,      // Option
    votes: string[],     // string[] array of user emails that voted for this option
    totalVotes: number
}

export default function PollOption({option, votes, totalVotes, id}:PollOption){
    const tripPageLayoutContext: TripPageLayoutContext = useTripPageLayoutContext();

    // email of current logged-in user - the voter
    const voter = tripPageLayoutContext.userDbDoc.get("email");
    
    async function handleVoteCasted () {
        if (tripPageLayoutContext.tripDbDoc) {
            console.log("User votedwadad: "+ voter)

            await dbAddVote(tripPageLayoutContext.tripDbDoc.ref, id, option, voter);
        } 
    }
    
    const voterPercentage = isNaN((votes.length / totalVotes) * 100) ? 0 : (votes.length / totalVotes) * 100;
    return (
        <div className="flex gap-4 w-full ">
            <h1 className="mt-2 w-8 font-sunflower text-sidebar_deep_green"><b>{voterPercentage}%</b></h1>
            <div className="flex flex-col gap-1 w-full">
                <div className="relative">
                    {/* <div className="absolute">{option}</div> */}
                    <div className="absolute h-full rounded-md bg-[#E29F2C] text-left font-sunflower text-sidebar_deep_green p-2 font-bold" 
                        style={{ width: `${voterPercentage}%` }}>
                            <div className="whitespace-nowrap pl-4 overflow-x-visible">{option}</div> 
                    </div>

                    <button 
                        className=" w-full h-10 bg-[#F8E14C] p-2 rounded-md text-left font-sunflower text-sidebar_deep_green font-bold"
                        onClick={() => handleVoteCasted()}
                    >
                         
                    </button>
                </div>
                

                <div className="flex gap-1 min-h-4">
                {votes.map((user, index) => (
                    <div className={`w-[14px] h-[14px] rounded-full ${tripPageLayoutContext.tripMembersInfo[user].color}`}></div>
                ))}
                </div>
            </div>
        </div>
    )
}