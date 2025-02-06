import ToadCount from "../modules/ToadCount";
import { debugLogComponentRerender } from "~/src/debugUtil";
import { useTripPageLayoutContext, type TripPageLayoutContext } from "./TripPageLayout";

export default function TripPagePlan() {

	debugLogComponentRerender("TripPagePlan");

	const tripPageLayoutContext: TripPageLayoutContext = useTripPageLayoutContext();

	const tripName = tripPageLayoutContext.tripDbDoc.get("trip_name");

	return (
		<div className="grow flex flex-col bg-dashboard_lime">
			<div className="bg-dashboard_component_bg rounded-lg p-5">
				<h1 className="text-sidebar_deep_green font-sunflower text-4xl" style={{ fontWeight: 900 }}>{tripName}</h1>
			</div>

			<ToadCount tripDbDoc={tripPageLayoutContext.tripDbDoc} />
		</div>
	);
}
