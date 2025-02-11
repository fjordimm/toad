import ToadCount from "../modules/ToadCount";
import { debugLogComponentRerender } from "~/src/debugUtil";
import { useTripPageLayoutContext, type TripPageLayoutContext } from "./TripPageLayout";
import { Link } from "react-router";
import Itinerary from "../modules/PlanPage/Itinerary";

export default function TripPagePlan() {

	debugLogComponentRerender("TripPagePlan");

	const tripPageLayoutContext: TripPageLayoutContext = useTripPageLayoutContext();

	const tripName = tripPageLayoutContext.tripDbDoc.get("trip_name");

	return (
		<div className="grow flex flex-col gap-5 bg-dashboard_lime">
			<div className="">
				<Link to="./.." className="bg-dashboard_component_bg py-2 px-4 rounded-lg font-sunflower text-sidebar_deep_green underline">Back</Link>
			</div>

			<div className="grow flex flex-row gap-5 justify-between">
				{/* Insert Itinerary Here */}
				<Itinerary tripDbDoc={tripPageLayoutContext.tripDbDoc}/>

				{/* Insert Possible Stops Column Here */}
				<p className="bg-slate-600">Possible Stops</p>
			</div>
		</div>
	);
}
