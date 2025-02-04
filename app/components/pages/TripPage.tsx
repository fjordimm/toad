import { doc, getDoc, onSnapshot, type DocumentReference, type DocumentSnapshot } from "firebase/firestore";
import ToadCount from "../modules/ToadCount";
import type { Route } from "./+types/TripPage";
import { useMainLayoutContext, type MainLayoutContext } from "./MainLayout";
import { useEffect, useState } from "react";
import { dbRetrieveTrip } from "~/src/databaseUtil";
import { firebaseDb } from "~/src/toadFirebase";
import CalendarCard from "../modules/Itinerary/CalendarCard";

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
		<div className="grow flex justify-between bg-dashboard_lime gap-6">
			<div className="flex flex-col w-full gap-4">
				<h1 className="w-full rounded-lg p-5 bg-dashboard_component_bg text-sidebar_deep_green font-sunflower text-4xl" style={{ fontWeight: 900 }}>{tripName}</h1>
				<CalendarCard date={new Date("2025-02-03")} />
			</div>

			<div className="max-w-2xl items-end">
				<ToadCount tripDbDoc={tripDbDoc} />
			</div>
			

		</div>
	);
}
