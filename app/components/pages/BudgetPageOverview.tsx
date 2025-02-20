import ToadCount from "../modules/ToadCount";
import { debugLogComponentRerender } from "~/src/debugUtil";
import { useTripPageLayoutContext, type TripPageLayoutContext } from "./TripPageLayout";
import { Link } from "react-router";

export default function BudgetPageMain() {

    return(
        <div className="grow flex flex-col gap-5 bg-dashboard_lime">
                    <div className="">
                        <Link to="./.." className="bg-dashboard_component_bg py-2 px-4 rounded-lg font-sunflower text-sidebar_deep_green underline">Back</Link>
                    </div>
        
                    <div className="grow flex flex-row gap-5 justify-between">
                        <div className="bg-[#D7F297] w-2/3 h-full"></div>
                    </div>
                </div>
    );

}