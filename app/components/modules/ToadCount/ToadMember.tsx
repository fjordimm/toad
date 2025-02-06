import type { DocumentSnapshot } from "firebase/firestore";
import React from "react";
import { dbRemoveUserFromTrip } from "~/src/databaseUtil";
import { debugLogComponentRerender, debugLogError } from "~/src/debugUtil";

{/* put names of members in trips here */ }
interface ToadMemberProps {
	name: string;
}

const memberColorArray: string[] = [
	"bg-trip_member_col_1",
	"bg-trip_member_col_2",
	"bg-trip_member_col_3",
	"bg-trip_member_col_4",
	"bg-trip_member_col_5",
	"bg-trip_member_col_6",
	"bg-trip_member_col_7",
	"bg-trip_member_col_8",
	"bg-trip_member_col_9",
	"bg-trip_member_col_10",
	"bg-trip_member_col_11",
	"bg-trip_member_col_12",
	"bg-trip_member_col_13",
	"bg-trip_member_col_14",
	"bg-trip_member_col_15"
];

export default function ToadMember(props: { memberColorIndex: number, tripDbDoc: DocumentSnapshot | null, memberDbDoc: DocumentSnapshot | null }) {

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
	
	const userColor: string = memberColorArray[props.memberColorIndex % 15];

	return (
		<div className="relative w-[148px] h-[28px] bg-[#8FA789]/40 rounded-lg shadow-sm">
			{/* Circle representing the color icon */}
			<div
				className={`w-[18.86px] h-[18.86px] rounded-full absolute left-[8px] top-1/2 transform -translate-y-1/2 ${userColor}`}
			></div>

			{/* Name (wrapped inside overflow-hidden div) */}
			<div className="absolute left-[45px] right-0 h-full overflow-hidden whitespace-nowrap text-ellipsis">
        		<span className="text-[#3C533A] font-sunflower text-sm leading-[30px]">
            		{memberName}
        		</span>
    		</div>

			{/* Delete Button */}
			<button
				onClick={handleRemoveMember}
				className="absolute left-[160px] w-[28px] h-[26px] top-1/2 transform -translate-y-1/2 bg-[#EACBAC] rounded-lg flex items-center justify-center hover:bg-[#EACBAC]/80"
			>
				<div className="absolute w-[16px] h-[0px] border border-white"></div>
			</button>
		</div>
	);
};
