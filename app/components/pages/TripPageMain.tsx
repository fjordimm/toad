import React from "react";
import ToadCount from "../modules/ToadCount";
import { debugLogComponentRerender } from "~/src/debugUtil";
import { useTripPageLayoutContext, type TripPageLayoutContext } from "./TripPageLayout";
import { Link } from "react-router";

export default function TripPageMain() {

    debugLogComponentRerender("TripPageMain");

    const tripPageLayoutContext: TripPageLayoutContext = useTripPageLayoutContext();

    const tripName: string = tripPageLayoutContext.tripDbDoc.get("trip_name");

    return (
        <div className="grow flex flex-row justify-between gap-5 bg-dashboard_lime">
            <div className="grow flex flex-col gap-5">
                <h1 className="bg-dashboard_component_bg rounded-lg p-5 text-sidebar_deep_green font-sunflower text-4xl" style={{ fontWeight: 900 }}>{tripName}</h1>

                <div className="">
                    <Link to="./plan" className="bg-dashboard_component_bg py-2 px-4 rounded-lg font-sunflower text-sidebar_deep_green underline">Plan</Link>
                </div>
            </div>

            <ToadCount tripDbDoc={tripPageLayoutContext.tripDbDoc} />
        </div>
    );
}
