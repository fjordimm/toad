import type { DocumentSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { dbRetrieveTripsListOfMembers } from "~/src/databaseUtil";
import { indexTo15UniqueColor, stringHash } from "~/src/miscUtil";
import AddMemberToExpense from "/AddMemberToExpense.svg";
import DeleteMemberFromExpense from "/DeleteMemberFromExpense.svg";
import Loading from "../../Loading";

export default function NewExpenseStepOne({ tripDbDoc, payees, setPayees }: { tripDbDoc: DocumentSnapshot | null, payees: { [key: string]: number }, setPayees: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>}) {
    const [listOfTripsMembers, setListOfTripMembers] = useState<DocumentSnapshot[] | null>(null);
    const [memberColors, setMemberColors] = useState<Record<string, number>>({});

    useEffect(() => {
        console.log("Payees updated:", payees); // making sure payees is being updated
    }, [payees]);

    useEffect(() => {
        if (tripDbDoc !== null) {
            dbRetrieveTripsListOfMembers(tripDbDoc).then((result) => {
                if (result) {
                    //made for consistency among the colors between added and non-added members to the expense
                    const colors: Record<string, number> = {};
                    const memberColorsAlreadyTaken = new Set<number>();

                    result.forEach(member => {
                        let colorNum = Math.abs(stringHash(member.id) % 15);
                        let loopCounter = 0;
                        while (memberColorsAlreadyTaken.has(colorNum) && loopCounter < 15) {
                            colorNum = (colorNum + 1) % 15;
                            loopCounter++;
                        }
                        memberColorsAlreadyTaken.add(colorNum);
                        colors[member.id] = colorNum;
                    });

                    setMemberColors(colors);
                    setListOfTripMembers(result);
                }
            });
        }
    }, [tripDbDoc]);

    //adds members to expense if the add button is clicked
    const HandleAddMember = (member: DocumentSnapshot) => {
        const memberId = member.id;
        if (!payees.hasOwnProperty(memberId)) {
            setPayees((prev) => ({
                ...prev,
                [memberId] : 0
            }));
        }
    };

    //deletes members from expense if delete button is clicked
    const HandleDeleteMember = (memberId: string) => {
        setPayees((prev) => {
            const updatedPayees = { ...prev };
            delete payees[memberId];
            delete updatedPayees[memberId]; // Remove the key
            return updatedPayees;
        })
    };

    //member boxes of members that were added to an expense and are in the subcontainer at the top
    const AddedMember = ({ member }: { member: DocumentSnapshot }) => {
        const memberName = `${member.get("first_name")} ${member.get("last_name")}`;
        const userColor = indexTo15UniqueColor(memberColors[member.id]);

        return (
            <div className="relative w-[148px] h-[28px] bg-[#ABC893] rounded-lg shadow-sm">
                <div className={`w-[18.86px] h-[18.86px] rounded-full absolute left-[8px] top-1/2 transform -translate-y-1/2 ${userColor}`}></div>
                <div className="absolute left-[45px] right-0 h-full overflow-hidden whitespace-nowrap text-ellipsis">
                    <span className="text-[#3C533A] font-sunflower text-sm leading-[30px]">
                        {memberName}
                    </span>
                </div>
                <button
                    onClick={() => HandleDeleteMember(member.id)}
                    className="absolute left-[155px] w-[28px] h-[26px] top-1/2 transform -translate-y-1/2"
                    aria-label="Delete Member From Expense"
                >
                    <img src={DeleteMemberFromExpense} alt="Delete Member From Expense" />
                </button>
            </div>
        );
    };

    //classic member box for members that can be added to an expense
    const MemberBox = ({ member }: { member: DocumentSnapshot }) => {
        const memberName = `${member.get("first_name")} ${member.get("last_name")}`;
        const userColor = indexTo15UniqueColor(memberColors[member.id]);

        return (
            <div className="relative w-[148px] h-[28px] bg-[#8FA789]/40 rounded-lg shadow-sm">
                <div className={`w-[18.86px] h-[18.86px] rounded-full absolute left-[8px] top-1/2 transform -translate-y-1/2 ${userColor}`}></div>
                <div className="absolute left-[45px] right-0 h-full overflow-hidden whitespace-nowrap text-ellipsis">
                    <span className="text-[#3C533A] font-sunflower text-sm leading-[30px]">
                        {memberName}
                    </span>
                </div>
                <button
                    onClick={() => HandleAddMember(member)}
                    className="absolute left-[155px] w-[28px] h-[26px] top-1/2 transform -translate-y-1/2"
                    aria-label="Add Member To Expense"
                >
                    <img src={AddMemberToExpense} alt="Add Member" />
                </button>
            </div>
        );
    };

    //lists out all the members in the trip that are not yet added to an expense
    const renderMemberBoxes = (members: DocumentSnapshot[] | null) => {
        if (members === null) return <Loading />;
        
        return members.map(member => {
            if (payees.hasOwnProperty(member.id)) return null;
            return <MemberBox key={member.id} member={member} />;
        });
    };

    //lists out all the members in the trio that have been added to an expense
    const renderAddedMembers = () => {
        if (listOfTripsMembers === null) return <Loading />;

        return Object.keys(payees).map(payeeId => {
            const member = listOfTripsMembers.find(m => m.id === payeeId);
            if (!member) return null;
            return <AddedMember key={member.id} member={member} />;
        });
    };

    //ui for the overall flow of the component
    return (
        <div className="w-[236px] h-[300px] bg-[#BDDE9A] p-6 pb-10 rounded-lg shadow-lg space-y-4">
            <div className="flex justify-center -mt-4">
                <div className="w-[217px] min-w-[217px] max-w-[217px] h-[55px] p-2 overflow-y-auto scrollbar-none space-y-3 bg-[#8FAE72] rounded-lg">
                    {renderAddedMembers()}
                </div>
            </div>

            <div className="h-[150px] overflow-y-auto scrollbar-none space-y-3 ml-1">
                {renderMemberBoxes(listOfTripsMembers)}
            </div>
        </div>
    );
}
