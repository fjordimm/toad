/*
 Description:
  The page layout (with url prefix '/trip/:tripId/') for the content for a specific trip.
  This component's main job is to load the trip document from the database, as well as generate the colors and load the names for all members of the trip, and pass both of those down to any children.
 
 Interactions:
  - Parent Component(s): MainLayout (as Outlet)
  - Direct Children Component(s): TripPageMain (as Outlet), TripPagePlan (as Outlet), TripPageExpenses (as Outlet)
  - Database: Firestore reads
*/

import React from "react";
import { debugLogComponentRerender } from "~/src/debugUtil";
import type { Route } from "./+types/TripPageLayout";
import { useEffect, useState } from "react";
import { doc, DocumentSnapshot, getDoc, onSnapshot, type DocumentReference } from "firebase/firestore";
import { firebaseDb } from "~/src/toadFirebase";
import { Outlet, useOutletContext } from "react-router";
import Loading from "../modules/Loading";
import { useMainLayoutContext, type MainLayoutContext } from "./MainLayout";
import { dbRetrieveAllTripUsers } from "~/src/databaseUtil";
import { indexTo15UniqueColor, stringHash } from "~/src/miscUtil";

// This type stores all users that are members of a trip, including their DocumentSnapshot and their color
// For any components that use user DocumentSnapshots or colors, they should ultimately get that information from TripPageLayout
export type TripMembersInfo = {
    [key: string]: {
        dbDoc: DocumentSnapshot,
        color: string
    }
}

export default function TripPageLayout({ params }: Route.ComponentProps) {

    debugLogComponentRerender("TripPageLayout");

    const mainLayoutContext: MainLayoutContext = useMainLayoutContext();

    const [tripDbDocRef, setTripDbDocRef] = useState<DocumentReference | null>(null);
    useEffect(
        () => {
            setTripDbDocRef(doc(firebaseDb, "trips", params.tripId as string));
        },
        [params.tripId]
    );

    const [tripDbDoc, setTripDbDoc] = useState<DocumentSnapshot | null>(null);
    useEffect(
        () => {
            if (tripDbDocRef !== null) {
                onSnapshot(tripDbDocRef, async () => {
                    setTripDbDoc(await getDoc(tripDbDocRef));
                });
            }
        },
        [tripDbDocRef]
    );

    const [tripMembersInfo, setMembersInfo] = useState<TripMembersInfo | null>(null);
    useEffect(
        () => {
            if (tripDbDoc !== null) {
                dbRetrieveAllTripUsers(tripDbDoc).then(
                    (result: DocumentSnapshot[]) => {
                        const newTripMembersInfo: TripMembersInfo = {};

                        // The code using memberColorsAlreadyTaken, colorNum, and loopCounter is to get a unique color for each user.
                        // It uses stringHash() on each user's email, but if two people have the same hash output, this algorithm will try to give them different colors.
                        const memberColorsAlreadyTaken: Set<number> = new Set<number>();

                        for (const memberDbDoc of result) {

                            let colorNum: number = Math.abs(stringHash(memberDbDoc.id) % 15);
                            let loopCounter: number = 0;
                            while (memberColorsAlreadyTaken.has(colorNum) && loopCounter < 15) {
                                colorNum = (colorNum + 1) % 15;
                                loopCounter++;
                            }
                            memberColorsAlreadyTaken.add(colorNum);

                            newTripMembersInfo[memberDbDoc.id] = {
                                dbDoc: memberDbDoc,
                                color: indexTo15UniqueColor(colorNum)
                            };
                        }

                        setMembersInfo(newTripMembersInfo);
                    }
                );
            }
        },
        [tripDbDoc]
    );

    return (
        tripDbDoc !== null && tripMembersInfo !== null
            ? <Outlet context={{ tripDbDoc: tripDbDoc, tripMembersInfo: tripMembersInfo, userDbDoc: mainLayoutContext.userDbDoc }} />
            : <Loading />
    );
}

// To be used by subroutes
export type TripPageLayoutContext = { tripDbDoc: DocumentSnapshot, tripMembersInfo: TripMembersInfo, userDbDoc: DocumentSnapshot };
export function useTripPageLayoutContext(): TripPageLayoutContext { return useOutletContext(); }