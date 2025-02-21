import React from "react";
import { debugLogComponentRerender } from "~/src/debugUtil";
import type { Route } from "./+types/TripPageLayout";
import { useEffect, useState } from "react";
import { doc, DocumentSnapshot, getDoc, onSnapshot, type DocumentReference } from "firebase/firestore";
import { firebaseDb } from "~/src/toadFirebase";
import { Outlet, useOutletContext } from "react-router";
import Loading from "../modules/Loading";
import { useMainLayoutContext, type MainLayoutContext } from "./MainLayout";

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

    return (
        tripDbDoc !== null
            ? <Outlet context={{ tripDbDoc: tripDbDoc, userDbDoc: mainLayoutContext.userDbDoc }} />
            : <Loading />
    );
}

// To be used by subroutes
export type TripPageLayoutContext = { tripDbDoc: DocumentSnapshot, userDbDoc: DocumentSnapshot };
export function useTripPageLayoutContext(): TripPageLayoutContext { return useOutletContext(); }