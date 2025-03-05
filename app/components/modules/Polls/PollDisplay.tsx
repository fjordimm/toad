import { useTripPageLayoutContext, type TripMembersInfo, type TripPageLayoutContext } from "~/components/pages/TripPageLayout"
import PollOption from "./PollOption";
import { dbDeletePoll } from "~/src/databaseUtil";
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

export default function PollCard ({pollID, description, options, poll_owner, title, votes}:PollData) {

    const tripPageLayoutContext: TripPageLayoutContext = useTripPageLayoutContext();
    
    //Get Full Name and Avatar Color
    const pollOwnerInfo = tripPageLayoutContext.tripMembersInfo?.[poll_owner];
    if (!pollOwnerInfo) {
        return <Loading />; // Loading poll owner
    }
    const userFullName = `${pollOwnerInfo.dbDoc.get("first_name")} ${pollOwnerInfo.dbDoc.get("last_name")}`;
    const userColor = pollOwnerInfo.color;


    async function handleDeletePoll() {
        if (tripPageLayoutContext.tripDbDoc) {
            await dbDeletePoll(tripPageLayoutContext.tripDbDoc.ref, pollID);
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
                            {/* <b>{item}</b> */}
                            <PollOption id= {pollID} option={item} votes={votes[item]} />
                        </div>
                )})}

                <button 
                    className="self-end bg-[#EACBAC] text-center p-1 rounded-md font-sunflower text-sidebar_deep_green w-24"
                    onClick={handleDeletePoll}
                >Delete Poll</button>
            </div>
        </div>
    )
}