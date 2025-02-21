import React from "react";
import { debugLogComponentRerender } from "~/src/debugUtil";

export default function Landing() {

    debugLogComponentRerender("LandingPage");

    // const mainLayoutContext: MainLayoutContext = useMainLayoutContext();

    return (
        <div className="grow flex justify-center items-center bg-dashboard_lime">
            <p className="font-sunflower text-sidebar_deep_green text-xl text-center p-5">Select a trip on the side panel to continue or create new trip!</p>
        </div>
    );
}
