/*
 Description:
  The card in the top right of a trip's main page, displaying a list of members of the trip, an invite button, and a delete trip button.
  However, the delete trip button and the buttons to remove members will only show up if the user is the owner of the trip.
 
 Interactions:
  - Parent Component(s): TripPageMain
  - Direct Children Component(s): ToadMember, ConfirmDelete
  - Database: Firestore writes
*/

import React, { type ReactNode } from "react";
import { useState } from "react";
import { Form } from "react-router";
import ToadMember from "./ToadCount/ToadMember";
import ConfirmDelete from "./ToadCount/ConfirmDelete"
import { type DocumentSnapshot } from "firebase/firestore";
import { dbInviteUser, DbNoUserFoundError } from "~/src/databaseUtil";
import { debugLogComponentRerender } from "~/src/debugUtil";
import type { TripMembersInfo } from "../pages/TripPageLayout";
import { useTripPageLayoutContext, type TripPageLayoutContext } from "../pages/TripPageLayout";

export default function ToadCount(props: { tripDbDoc: DocumentSnapshot | null, tripMembersInfo: TripMembersInfo }) {

    debugLogComponentRerender("ToadCount");

    const tripPageLayoutContext: TripPageLayoutContext = useTripPageLayoutContext();
    const trip_active_users: string[] = tripPageLayoutContext.tripDbDoc.get("trip_active_users");

    function turnListOfTripsMembersIntoElems(): ReactNode {
        return Object.keys(props.tripMembersInfo).map((memberEmailId) => {
            const memberInfo = props.tripMembersInfo[memberEmailId];

            if (trip_active_users.includes(memberInfo.dbDoc.get("email"))) {
                return (
                    <ToadMember key={memberInfo.dbDoc.id} memberColor={memberInfo.color} tripDbDoc={props.tripDbDoc} memberDbDoc={memberInfo.dbDoc} isTripOwner={isTripOwner} />
                );
            }
        });
    }

    const [email, setEmail] = useState<string>("");
    const [inviteError, setInviteError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const currUser: string = tripPageLayoutContext.userDbDoc.get("email");
    let isTripOwner: boolean = true;
    if (tripPageLayoutContext.tripDbDoc.get("trip_owner") !== currUser) {
        isTripOwner = false;
    }

    async function handleInviteSubmit() {

        const emailId: string = email;
        setEmail("");

        if (props.tripDbDoc !== null) {
            try {
                await dbInviteUser(props.tripDbDoc.ref, emailId);

                setInviteError(null);
            } catch (err) {
                if (err instanceof DbNoUserFoundError) {
                    setInviteError("The user inputted does not exist.");
                } else {
                    throw err;
                }
            }
        }
    }

    const toadCount: string = props.tripDbDoc !== null
        ? props.tripDbDoc.get("trip_active_users").length
        : "?"
        ;

    return (
        <div className="">
            {/* Main Container */}
            <div
                className="max-w-[271px] w-full bg-[#EAFFB9] p-6 rounded-lg shadow-lg flex flex-col justify-between"
            >
                {/* Toad Count */}
                <div className="flex flex-col items-center text-[24px] font-sunflower text-[#3C533A]">
                    Toad Count: {toadCount}
                </div>

                {/* Member List */}
                <div className="mt-4 h-[135px] overflow-y-auto scrollbar-none space-y-3">
                    {/* Can add members to the trip by calling <ToadMembers name="name" /> */}
                    {turnListOfTripsMembersIntoElems()}
                </div>

                {/* Email Input and Invite Button */}
                <Form onSubmit={handleInviteSubmit} className="mt-4 flex flex-col items-center space-y-3">
                    <input
                        type="email"
                        placeholder="Enter member email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full max-w-[207px] h-[22px] bg-white border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-lime-400 text-center"
                    />
                    <button
                        className="w-full max-w-[207px] h-[29px] bg-[#BCD3B5]/50 text-[#3C533A] rounded-lg text-sm hover:bg-[#BCD3B5]/70 text-center"
                    >
                        + Invite Member
                    </button>
                    {inviteError !== null
                        ? <p className="font-maven text-red-400 width-2">{inviteError}</p>
                        : <></>
                    }
                </Form>
            </div>

            {/* Delete Trip Button */}
            {isTripOwner && (<div className="mt-3 flex flex-col">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-[271px] h-[46px] bg-[#D86D6D]/50 text-white rounded-lg text-sm hover:bg-[#D86D6D]/70 text-center"
                >
                    Delete Trip
                </button>
            </div>)}
            {isModalOpen && (
                <ConfirmDelete
                    tripDbDoc={props.tripDbDoc}
                    onClose={() => setIsModalOpen(false)}
                />)}
        </div>
    );
}
