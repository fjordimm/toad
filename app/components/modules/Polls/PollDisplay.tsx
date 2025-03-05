import type { TripMembersInfo } from "~/components/pages/TripPageLayout"
// Properties of a Poll
interface PollData{
    tripMembersInfo: TripMembersInfo,
    description: string,
    options: string[],
    poll_owner: string,
    time_added: Number,
    title: string,
    votes: Record<string, string[]>
}

export default function PollCard ({tripMembersInfo, description, options, poll_owner, time_added, title}:PollData) {

    //Get Full Name and Avatar Color
    const userFullName = `${tripMembersInfo[poll_owner].dbDoc.get("first_name")} ${tripMembersInfo[poll_owner].dbDoc.get("last_name")}`;
    const userColor = tripMembersInfo[poll_owner].color;

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
                            <div className="w-96 bg-[#F8E14C] p-2 rounded-md">
                                {item} 
                            </div>
                            <h1 className="font-sunflower text-sidebar_deep_green"><b>30%</b></h1>
                        </div>
                )})}

                <button 
                    className="self-end bg-[#EACBAC] text-center p-1 rounded-md font-sunflower text-sidebar_deep_green w-24"
                >Delete Poll</button>
            </div>
        </div>
    )
}