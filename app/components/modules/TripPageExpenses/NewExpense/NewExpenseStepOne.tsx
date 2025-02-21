import type { DocumentSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { dbRetrieveTripsListOfMembers } from "~/src/databaseUtil";
import { indexTo15UniqueColor, stringHash } from "~/src/miscUtil";
import AddMemberToExpense from "/AddMemberToExpense.svg";
import DeleteMemberFromExpense from "/DeleteMemberFromExpense.svg";
import Loading from "../../Loading";

export default function NewExpenseStepOne(props: { tripDbDoc: DocumentSnapshot | null}) {
    const [listOfTripsMembers, setListOfTripMembers] = useState<DocumentSnapshot[] | null>(null);

    useEffect(() => {
        if (props.tripDbDoc !== null) {
            dbRetrieveTripsListOfMembers(props.tripDbDoc).then((result: DocumentSnapshot[] | null) => {
                setListOfTripMembers(result);
            });
        }
    }, [props.tripDbDoc]);

    function AddedMember({ member, colorIndex}: { member: DocumentSnapshot, colorIndex: number}) {
        const memberName = `${member.get("first_name")} ${member.get("last_name")}`;
        const userColor = indexTo15UniqueColor(colorIndex);

        return (
            <div className={`relative w-[148px] h-[28px] bg-[#8FA789]/40 rounded-lg shadow-sm`}>
                <div className={`w-[18.86px] h-[18.86px] rounded-full absolute left-[8px] top-1/2 transform -translate-y-1/2 ${userColor}`}></div>
                <div className="absolute left-[45px] right-0 h-full overflow-hidden whitespace-nowrap text-ellipsis">
                    <span className="text-[#3C533A] font-sunflower text-sm leading-[30px]">
                        {memberName}
                    </span>
                </div>
                <button
                    //onClick -> delete member from added to expense and return to main list
                    className="absolute left-[155px] w-[28px] h-[26px] top-1/2 transform -translate-y-1/2"
                    aria-label={"Delete Member From Expense"}
                >
                    <img src={DeleteMemberFromExpense} alt={"Delete Member From Expense"} />
                </button>
            </div>
        );
    }

    function HandleAddMember(member: DocumentSnapshot) {
    }



    function MemberBox({ member, colorIndex}: { member: DocumentSnapshot, colorIndex: number}) {
        const memberName = `${member.get("first_name")} ${member.get("last_name")}`;
        const userColor = indexTo15UniqueColor(colorIndex);

        return (
            <div className={`relative w-[148px] h-[28px] bg-[#8FA789]/40 rounded-lg shadow-sm`}>
                <div className={`w-[18.86px] h-[18.86px] rounded-full absolute left-[8px] top-1/2 transform -translate-y-1/2 ${userColor}`}></div>
                <div className="absolute left-[45px] right-0 h-full overflow-hidden whitespace-nowrap text-ellipsis">
                    <span className="text-[#3C533A] font-sunflower text-sm leading-[30px]">
                        {memberName}
                    </span>
                </div>
                <button
                    //onClick={() => isAdded ? handleRemoveMember(member) : handleAddMember(member)}
                    //onClick -> call handleaddmember
                    className="absolute left-[155px] w-[28px] h-[26px] top-1/2 transform -translate-y-1/2"
                    aria-label={"Add Member To Expense"}
                >
                    <img src={AddMemberToExpense} alt={"Add Member"} />
                </button>
            </div>
        );
    }

    function renderMemberBoxes(members: DocumentSnapshot[] | null) {
        if (members === null) return <Loading />;

        const memberColorsAlreadyTaken: Set<number> = new Set<number>();

        return members.map(member => {
            let colorNum = Math.abs(stringHash(member.id) % 15);
            let loopCounter = 0;
            while (memberColorsAlreadyTaken.has(colorNum) && loopCounter < 15) {
                colorNum = (colorNum + 1) % 15;
                loopCounter++;
            }
            memberColorsAlreadyTaken.add(colorNum);

            return <MemberBox key={member.id} member={member} colorIndex={colorNum}/>;
        });
    }

    return (
        <div className="w-[230px] bg-[#BDDE9A] p-6 rounded-lg shadow-lg flex flex-col justify-between"> 
            <div className="space-y-4">
                {/* Top Container for Added Members */}
                <div className="p-2 h-[55px] overflow-y-auto scrollbar-none space-y-3 bg-[#8FAE72] rounded-lg">
                    {/*renderMemberBoxes(membersAddedToCurrentExpense, true)*/}
                </div>

                {/* All Members List */}
                <div className="mt-4 h-[150px] overflow-y-auto scrollbar-none space-y-3 items-center">
                    {renderMemberBoxes(listOfTripsMembers)}
                </div>
            </div>
        </div>
    );
}
