import React from "react";
import { debugLogComponentRerender } from "~/src/debugUtil";
import type { Route } from "./+types/TripPageLayout";
import { useEffect, useState } from "react";
import { doc, DocumentSnapshot, getDoc, onSnapshot, type DocumentReference } from "firebase/firestore";
import { firebaseDb } from "~/src/toadFirebase";
import { Outlet, useOutletContext } from "react-router";
import Loading from "../modules/Loading";
import { useMainLayoutContext, type MainLayoutContext } from "./MainLayout";
import { dbRetrieveAllTripUsers, dbRetrieveUser } from "~/src/databaseUtil";
import { indexTo15UniqueColor } from "~/src/miscUtil";

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
                        
                        for (let memberDbDoc of result) {
                            newTripMembersInfo[memberDbDoc.id] = {
                                dbDoc: memberDbDoc,
                                color: indexTo15UniqueColor(2)
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