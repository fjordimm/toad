import type { DocumentSnapshot } from "firebase/firestore";
import ToadCount from "../modules/ToadCount";
import type { Route } from "./+types/TripPage";
import { useMainLayoutContext, type MainLayoutContext } from "./MainLayout";
import { useState } from "react";
import { retrieveTripDbDoc } from "~/src/databaseUtil";

export default function TripPage({ params }: Route.ComponentProps) {

	const mainLayoutContext: MainLayoutContext = useMainLayoutContext();

	const [tripDbDoc, setTripDbDoc] = useState<DocumentSnapshot | null>(null);
	retrieveTripDbDoc(params.tripId).then(
		(result: DocumentSnapshot | null) => {
			if (result != null) {
				setTripDbDoc(result);
			} else {
				setTripDbDoc(null);
			}
		}
	);

	return (
		<div className="grow flex flex-col bg-dashboard_lime">
			<div className="bg-dashboard_component_bg rounded-lg p-5">
				{/* TODO: better null checking */}
				<h1 className="text-sidebar_deep_green font-sunflower text-4xl" style={{ fontWeight: 900 }}>{tripDbDoc?.data()?.tripName}</h1>
			</div>

			<ToadCount />
		</div>
	);
}
