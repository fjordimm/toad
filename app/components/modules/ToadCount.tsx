import React from "react";
import { useEffect, useState } from "react";
import { Form, useNavigate } from "react-router";
import ToadMember from "./ToadCount/ToadMember";
import { type DocumentSnapshot } from "firebase/firestore";
import { dbDeleteTrip, dbInviteUser, DbNoUserFoundError, dbRetrieveTripsListOfMembers } from "~/src/databaseUtil";
import Loading from "./Loading";
import { debugLogComponentRerender, debugLogError } from "~/src/debugUtil";
import { stringHash } from "~/src/miscUtil";

export default function ToadCount(props: { tripDbDoc: DocumentSnapshot | null }) {

    debugLogComponentRerender("ToadCount");

    const navigate = useNavigate();

    const [listOfTripsMembers, setListOfTripMembers] = useState<DocumentSnapshot[] | null>(null);
    useEffect(
        () => {
            if (props.tripDbDoc !== null) {
                dbRetrieveTripsListOfMembers(props.tripDbDoc).then(
                    (result: DocumentSnapshot[] | null) => {
                        setListOfTripMembers(result);
                    }
                );
            }
        },
        [props.tripDbDoc]
    );

    function turnListOfTripsMembersIntoElems(listOfTripsMembers: DocumentSnapshot[] | null) {
        if (listOfTripsMembers !== null) {

            // The code using memberColorsAlreadyTaken, colorNum, and loopCounter is to get a unique color for each user.
            // It uses stringHash() on each user's email, but if two people have the same hash output, this algorithm will try to give them different colors.
            const memberColorsAlreadyTaken: Set<number> = new Set<number>();

            return listOfTripsMembers.map((member: DocumentSnapshot) => {
                let colorNum: number = Math.abs(stringHash(member.id) % 15);
                let loopCounter: number = 0;
                while (memberColorsAlreadyTaken.has(colorNum) && loopCounter < 15) {
                    colorNum = (colorNum + 1) % 15;
                    loopCounter++;
                }
                memberColorsAlreadyTaken.add(colorNum);

                return <ToadMember key={member.id} memberColorIndex={colorNum} tripDbDoc={props.tripDbDoc} memberDbDoc={member} />
            });
        } else {
            return <Loading />;
        }
    }

    const [email, setEmail] = useState<string>("");
    const [inviteError, setInviteError] = useState<string | null>(null);

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

    async function handleDeleteTrip(tripDbDoc: DocumentSnapshot | null) {
        if (tripDbDoc !== null) {
            await dbDeleteTrip(tripDbDoc);
            navigate("/");
        } else {
            debugLogError("Trying to delete an invalid trip.");
        }
    }

    const toadCount: string = props.tripDbDoc !== null
        ? props.tripDbDoc.get("trip_users").length
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
                <div className="mt-4 h-[150px] overflow-y-auto scrollbar-none space-y-3">
                    {/* Can add members to the trip by calling <ToadMembers name="name" /> */}
                    {/* <ToadMember name="Angelina" />
					<ToadMember name="Billiam" />
					<ToadMember name="Sophie" />
					<ToadMember name="Arnav" />
					<ToadMember name="Jiggy" />
					<ToadMember name="Angelina" /> */}
                    {turnListOfTripsMembersIntoElems(listOfTripsMembers)}
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
            <div className="mt-2 flex flex-col">
                <button
                    onClick={() => handleDeleteTrip(props.tripDbDoc)}
                    className="w-[271px] h-[46px] bg-[#D86D6D]/50 text-white rounded-lg text-sm hover:bg-[#D86D6D]/70 text-center"
                >
                    Delete Trip
                </button>
            </div>
        </div>
    );
}
