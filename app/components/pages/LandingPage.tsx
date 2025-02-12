import type { DocumentSnapshot } from "firebase/firestore";
import { useOutletContext } from "react-router";
import { useMainLayoutContext, type MainLayoutContext } from "./MainLayout";
import { debugLogComponentRerender } from "~/src/debugUtil";
import AddDestination from "../modules/PlanPage/AddDestination";

export default function Landing() {

	debugLogComponentRerender("LandingPage");

	// const mainLayoutContext: MainLayoutContext = useMainLayoutContext();

	return (
		<div className="grow flex justify-center items-center bg-dashboard_lime">
			<p className="font-sunflower text-sidebar_deep_green text-xl text-center p-5">Select a trip on the side panel to continue or create new trip!</p>
		</div>
	);
}
