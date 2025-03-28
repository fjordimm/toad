/*
 Description:
  The menu bar that always shows up on the left part of your screen (except for the sign-in or sign-up page).
  This will display all trips that the user is a part of, as well as any pending invitations.
 
 Interactions:
  - Parent Component(s): MainLayout
  - Direct Children Component(s): TripsButton, InvitationButton
  - Database: Firestore reads, Firebase Authentication
*/

import React, { useRef } from "react";
import InvitationButton from "./MenuBar/InvitationButton";
import { useEffect, useState, type ReactNode } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import { firebaseAuth } from "~/src/toadFirebase";
import { Link, useNavigate } from "react-router";
import TripsButton from "./MenuBar/TripButton";
import Loading from "./Loading";
import { dbRetrieveUsersListOfInvitations, dbRetrieveUsersListOfTrips } from "~/src/databaseUtil";
import { debugLogComponentRerender } from "~/src/debugUtil";
import { stringHash } from "~/src/miscUtil";
import logo from "/toadLogo.svg";

export default function MenuBar(props: { userDbDoc: DocumentSnapshot }) {

    debugLogComponentRerender("MenuBar");

    function turnUserListOfTripsIntoElems(userListOfTrips: DocumentSnapshot[] | null): ReactNode {
        if (userListOfTrips !== null) {

            // The code using tripColorsAlreadyTaken, colorNum, and loopCounter is to get a unique color for each trip.
            // It uses stringHash() on each trip's id, but if two trips have the same hash output, this algorithm will try to give them different colors.
            const tripColorsAlreadyTaken: Set<number> = new Set<number>();

            return userListOfTrips.map((trip: DocumentSnapshot) => {
                let colorNum: number = Math.abs(stringHash(trip.id) % 15);
                let loopCounter: number = 0;
                while (tripColorsAlreadyTaken.has(colorNum) && loopCounter < 15) {
                    colorNum = (colorNum + 1) % 15;
                    loopCounter++;
                }
                tripColorsAlreadyTaken.add(colorNum);

                return <TripsButton key={trip.id} tripDbDoc={trip} tripColorIndex={colorNum} />
            });
        } else {
            return <Loading />;
        }
    }

    function turnUserListOfInvitationsIntoElems(userListOfInvitations: DocumentSnapshot[] | null): ReactNode {
        if (userListOfInvitations !== null) {
            return userListOfInvitations.map((trip: DocumentSnapshot) => {
                return <InvitationButton key={trip.id} userDbDoc={props.userDbDoc} tripDbDoc={trip} />;
            });
        } else {
            return <Loading />;
        }
    }

    const navigate = useNavigate();

    const [open, setOpen] = useState(true);

    const [userListOfTrips, setUserListOfTrips] = useState<DocumentSnapshot[] | null>(null);
    {
        const raceConditionId = useRef<number>(0); // This is used only for solving a race condition

        useEffect(
            () => {
                raceConditionId.current += 1;
                const oldRaceConditionId = raceConditionId.current;

                dbRetrieveUsersListOfTrips(props.userDbDoc).then(
                    (result: DocumentSnapshot[] | null) => {
                        setUserListOfTrips((currentVal: DocumentSnapshot[] | null) => {
                            if (raceConditionId.current === oldRaceConditionId) {
                                return result;
                            } else {
                                return currentVal;
                            }
                        });
                    }
                );
            },
            [props.userDbDoc]
        );
    }

    const [userListOfInvitations, setUserListOfInvitations] = useState<DocumentSnapshot[] | null>(null);
    {
        const raceConditionId = useRef<number>(0); // This is used only for solving a race condition

        useEffect(
            () => {
                raceConditionId.current += 1;
                const oldRaceConditionId = raceConditionId.current;

                dbRetrieveUsersListOfInvitations(props.userDbDoc).then(
                    (result: DocumentSnapshot[] | null) => {
                        setUserListOfInvitations((currentVal: DocumentSnapshot[] | null) => {
                            if (raceConditionId.current === oldRaceConditionId) {
                                return result;
                            } else {
                                return currentVal;
                            }
                        });
                    }
                );
            },
            [props.userDbDoc]
        );
    }

    async function handleLogOut() {
        await firebaseAuth.signOut();
        navigate("/sign-in");
    }

    const userFirstName: string = props.userDbDoc.get("first_name");
    const userLastName: string = props.userDbDoc.get("last_name");

    return (
        <div className={`${open ? "min-w-72 w-72" : "min-w-5 w-5"} relative h-screen bg-sidebar_deep_green transition-width duration-300 ease-in-out overflow-hidden`}>
            {/* Collapse button */}
            <button
                className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white px-2 py-2 rounded-xl h-32 bg-sidebar_deep_green"
                style={{ zIndex: 10 }}
                onClick={() => setOpen(!open)}
            >
                {open ? "\u276E" : "\u276F"}
            </button>

            {open ? (
                <div className="flex flex-col h-full">
                    {/* Fixed Logo and Welcome Section */}
                    <div className="flex-shrink-0">
                        <Link className="flex flex-row font-lilita text-4xl text-white justify-center items-center w-full" to="/">
                            <p className="justify-self-center mt-3 mr-3">TOAD</p>
                            <img src={logo} width={50} height={50} alt="toadLogo" className="justify-self-center mt-3"></img>
                        </Link>
                        <h1 className="text-center text-white font-sunflower text-lg py-4 px-4 pb-6">
                            Welcome Back, {`${userFirstName} ${userLastName}`}
                        </h1>
                    </div>

                    <div className="flex-grow overflow-y-auto">
                        {/* Your trips section */}
                        <h3 className="text-center text-white font-sunflower text-base px-4">
                            Your Trips
                        </h3>
                        {turnUserListOfTripsIntoElems(userListOfTrips)}
                        <div className="flex items-center bg-sidebar_deep_green px-14 py-2 mb-6 rounded-lg">
                            <Link to="/create-trip" className="relative rounded-full h-7 w-7 flex items-center justify-center bg-[#4E6A55] text-white">
                                +
                            </Link>
                            <span className="ml-2 pt-1 text-white text-sm font-sunflower">
                                Create New Trip
                            </span>
                        </div>

                        {/* Invitations section */}
                        <h3 className="text-center text-white font-sunflower text-base px-4">
                            Invitations
                        </h3>
                        {turnUserListOfInvitationsIntoElems(userListOfInvitations)}
                    </div>

                    {/* Log Out button */}
                    <div className="flex-shrink-0 flex justify-center my-4">
                        <button onClick={handleLogOut} className="relative flex items-center justify-center py-2 px-4 rounded-lg shadow-md w-4/5 max-w-xs">
                            <span className="absolute rounded-lg inset-0 bg-[#D86D6D] opacity-75"></span>
                            <span className="relative text-center text-white font-sunflower text-lg">
                                Log Out
                            </span>
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
