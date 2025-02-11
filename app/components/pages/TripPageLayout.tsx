import { debugLogComponentRerender } from "~/src/debugUtil";
import type { Route } from "./+types/TripPageLayout";
import { useEffect, useState } from "react";
import { doc, DocumentSnapshot, getDoc, onSnapshot, type DocumentReference } from "firebase/firestore";
import { firebaseDb } from "~/src/toadFirebase";
import { Outlet, useOutletContext } from "react-router";
import Loading from "../modules/Loading";

export default function TripPageLayout({ params }: Route.ComponentProps) {

	debugLogComponentRerender("TripPageLayout");

	const [tripDbDocRef, setTripDbDocRef] = useState<DocumentReference | null>(null);
	useEffect(
		() => {
			setTripDbDocRef(doc(firebaseDb, "trips", params.tripId as string));
		},
		[ params.tripId ]
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
		[ tripDbDocRef ]
	);

	return (
		tripDbDoc !== null
		? <Outlet context={{ tripDbDoc: tripDbDoc }}/>
		: <Loading />
	);
}

// To be used by subroutes
export type TripPageLayoutContext = { tripDbDoc: DocumentSnapshot };
export function useTripPageLayoutContext(): TripPageLayoutContext { return useOutletContext(); }
