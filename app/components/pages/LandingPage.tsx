/*
 Description:
  The page (with url '/') when you first log in to TOAD. It only contains a simple message in the center of the screen.
 
 Interactions:
  - Parent Component(s): MainLayout (as Outlet)
  - Direct Children Component(s): none
  - Database: none
*/

import React from "react";
import { debugLogComponentRerender } from "~/src/debugUtil";

export default function LandingPage() {

    debugLogComponentRerender("LandingPage");

    return (
        <div className="grow flex justify-center items-center bg-dashboard_lime">
            <p className="font-sunflower text-sidebar_deep_green text-xl text-center p-5">Select a trip on the side panel to continue or create new trip!</p>
        </div>
    );
}
