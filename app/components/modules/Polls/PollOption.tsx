
import { useTripPageLayoutContext, type TripPageLayoutContext } from "app/components/pages/TripPageLayout";
import { getDoc } from "firebase/firestore";
import { dbAddVote } from "~/src/databaseUtil";


interface PollOption{
    id: string,
    option: string,      // Option
    votes: string[],     // string[] array of user emails that voted for this option
    totalVotes: number
}

// Includes yellow option box and percentage
export default function PollOption({option, votes, totalVotes, id}:PollOption){

    const tripPageLayoutContext: TripPageLayoutContext = useTripPageLayoutContext();

    // email of current logged-in user - the voter
    const voter = tripPageLayoutContext.userDbDoc.get("email");
    
    // Adds user to database for corresponding vote once they click on an option
    async function handleVoteCasted () {
        if (tripPageLayoutContext.tripDbDoc) {
            console.log("User votedwadad: "+ voter)

            await dbAddVote(tripPageLayoutContext.tripDbDoc.ref, id, option, voter);
        } 
    }
    
    // Ratio of:     voters who voted for this option / total voters
    // NaN values return 0
    const voterPercentage = isNaN((votes.length / totalVotes) * 100) ? 0 : Math.round((votes.length / totalVotes) * 100);

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
                            <div className="whitespace-nowrap pl-4 overflow-x-visible">{option}</div> 
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
                    {votes.map((user, index) => (
                        <div className={`w-[14px] h-[14px] rounded-full ${tripPageLayoutContext.tripMembersInfo[user].color}`}></div>
                    ))}
                </div>
            </div>
        </div>
    )
}