/*
 Description:
  A card representing a single member within ToadCount.
 
 Interactions:
  - Parent Component(s): ToadCount
  - Direct Children Component(s): none
  - Database: Firestore writes
*/

import type { DocumentSnapshot } from "firebase/firestore";
import React from "react";
import { dbRemoveUserFromTrip } from "~/src/databaseUtil";
import { debugLogComponentRerender, debugLogError } from "~/src/debugUtil";

export default function ToadMember(props: { memberColor: string, tripDbDoc: DocumentSnapshot | null, memberDbDoc: DocumentSnapshot | null, isTripOwner: boolean}) {

    debugLogComponentRerender("ToadMember");

    async function handleRemoveMember() {
        if (props.tripDbDoc !== null && props.memberDbDoc !== null) {
            await dbRemoveUserFromTrip(props.tripDbDoc, props.memberDbDoc);
        } else {
            debugLogError("Trying to remove a member from an invalid ToadMember component.");
        }
    }

    const memberName: string = props.memberDbDoc !== null
        ? `${props.memberDbDoc.get("first_name")} ${props.memberDbDoc.get("last_name")}`
        : "Invalid Member"
        ;

    return (
        <div className = "flex flex-row  w-full">
            <div className={`relative ${props.isTripOwner ? 'w-10/12' : 'w-full'} items-center h-[28px] bg-[#8FA789]/40 rounded-lg shadow-sm`}>
                {/* Circle representing the color icon */}
                <div
                    className={`w-[18.86px] h-[18.86px] rounded-full absolute left-[8px] top-1/2 transform -translate-y-1/2 ${props.memberColor}`}
                ></div>

                {/* Name (wrapped inside overflow-hidden div) */}
                <div className="absolute left-[45px] right-2 h-full overflow-hidden whitespace-nowrap text-ellipsis">
                    <span className="text-[#3C533A] font-sunflower text-sm leading-[30px]">
                        {memberName}
                    </span>
                </div>
            </div>
            {/* Delete Button */}
            {props.isTripOwner && (<button
                onClick={handleRemoveMember}
                className="w-[28px] h-[26px] ml-auto bg-[#EACBAC] rounded-lg flex items-center justify-center hover:bg-[#EACBAC]/80"
            >
                <div className="w-[16px] h-[0px] border border-white"></div>
            </button>)}
        </div>
    );
};
