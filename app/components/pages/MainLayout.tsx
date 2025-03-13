/*
 Description:
  The main page layout. It has the menu bar on the left, and the subpage on the right.
 
 Interactions:
  - Parent Component(s): TopLevelLayout (as Outlet)
  - Direct Children Component(s): MenuBar, LandingPage (as Outlet), CreateTrip (as Outlet), TripPageLayout (as Outlet)
  - Database: none
*/

import React from "react";
import { Link, Outlet, useOutletContext } from "react-router";
import MenuBar from "../modules/MenuBar";
import type { DocumentSnapshot } from "firebase/firestore";
import { useTopLevelLayoutContext, type TopLevelLayoutContext } from "./TopLevelLayout";
import { debugLogComponentRerender } from "~/src/debugUtil";

export default function MainLayout() {

    debugLogComponentRerender("MainLayout");

    const topLevelLayoutContext: TopLevelLayoutContext = useTopLevelLayoutContext();

    if (topLevelLayoutContext.userDbDoc !== null) {
        return (
            <div className="max-w-full flex flex-row overflow-hidden max-h-[100vh]">
                <MenuBar userDbDoc={topLevelLayoutContext.userDbDoc} />
                <div className="grow m-5 overflow-y-auto flex flex-col">
                    {/* Sub pages (as defined in routes.ts) */}
                    <Outlet context={{ userDbDoc: topLevelLayoutContext.userDbDoc }} />
                </div>
            </div>
        );
    } else {
        // Alternative 'You are not signed in' page.
        return (
            <div>
                <p>You are not signed in.</p>
                <Link to="/sign-in" className="underline">Sign In</Link>
            </div>
        );
    }
}

// To be used by subroutes
export type MainLayoutContext = { userDbDoc: DocumentSnapshot };
export function useMainLayoutContext(): MainLayoutContext { return useOutletContext(); }
