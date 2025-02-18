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
            <div className="grow flex flex-row overflow-hidden max-h-[100vh]">
                <MenuBar userDbDoc={topLevelLayoutContext.userDbDoc} />
                <div className="m-5 grow flex overflow-y-auto">
                    <Outlet context={{ userDbDoc: topLevelLayoutContext.userDbDoc }} />
                </div>
            </div>
        );
    } else {
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
