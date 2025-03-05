
import { useTripPageLayoutContext, type TripPageLayoutContext } from "app/components/pages/TripPageLayout";
import { getDoc } from "firebase/firestore";


interface PollOption{
    option: string,      // Option
    votes: string[],     // string[] array of user emails that voted for this option
}

export default function PollOption({option}:PollOption){
    const tripPageLayoutContext: TripPageLayoutContext = useTripPageLayoutContext();




    
    // email of current logged-in user - the voter
    const voter = tripPageLayoutContext.userDbDoc.get("email");
    const userColor = tripPageLayoutContext.tripMembersInfo[voter].color;
    
    
    // const handleVoteCasted = async () => {
    //     if 
    // }
    
    return (
        <div className="flex gap-4 items-center">
            <button 
                className="w-96 bg-[#F8E14C] p-2 rounded-md text-left font-sunflower text-sidebar_deep_green font-bold"
                // onClick={() => handleVoteCasted()}
            >
                {option} 
            </button>
            <h1 className="font-sunflower text-sidebar_deep_green"><b>30%</b></h1>
        </div>
    )
}