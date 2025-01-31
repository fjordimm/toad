import { doc, getDoc, onSnapshot, type DocumentReference, type DocumentSnapshot } from "firebase/firestore";
import ToadCount from "../modules/ToadCount";
import type { Route } from "./+types/TripPage";
import { useMainLayoutContext, type MainLayoutContext } from "./MainLayout";
import { useEffect, useState } from "react";
import { dbRetrieveTrip } from "~/src/databaseUtil";
import { firebaseDb } from "~/src/toadFirebase";

export default function TripPage({ params }: Route.ComponentProps) {

	console.log("TRIP PAGE RERENDERING");

	const mainLayoutContext: MainLayoutContext = useMainLayoutContext();

	// const tripDbDocRef: DocumentReference = doc(firebaseDb, "trips", params.tripId);
	const [tripDbDocRef, setTripDbDocRef] = useState<DocumentReference | null>(null);
	useEffect(
		() => {
			setTripDbDocRef(doc(firebaseDb, "trips", params.tripId));
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

	const tripName = tripDbDoc?.get("trip_name");

	return (
		<div className="grow flex flex-col bg-dashboard_lime">
			<div className="bg-dashboard_component_bg rounded-lg p-5">
				<h1 className="text-sidebar_deep_green font-sunflower text-4xl" style={{ fontWeight: 900 }}>{tripName}</h1>
			</div>

			<ToadCount tripDbDoc={tripDbDoc} />
		</div>
	);
}
