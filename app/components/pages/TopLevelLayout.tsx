/*
 Description:
  The parent of all other routes.
  This component's only job is to perform authentication, read the user doc from the database, and pass that down to any children.
 
 Interactions:
  - Parent Component(s): none (it is the highest level route)
  - Direct Children Component(s): SignInPage (as Outlet), SignUpPage (as Outlet), MainLayout (as Outlet)
  - Database: Firebase Authentication, Firestore reads
*/

import React from "react";
import { Outlet, useOutletContext } from "react-router";
import { useEffect, useState } from "react";
import { getDoc, onSnapshot, type DocumentReference, type DocumentSnapshot, type Unsubscribe } from "firebase/firestore";
import { dbCheckAndGetUserAuthentication } from "~/src/databaseUtil";
import { debugLogComponentRerender } from "~/src/debugUtil";

export function meta() {
    return [
        { title: "TOAD" },
        { name: "description", content: "To Outline A Destination" },
    ];
}

let userDbListenerUnsub: Unsubscribe | null = null;
function unsubFromUserDbListener() {
    if (userDbListenerUnsub !== null) {
        userDbListenerUnsub();
    }
}

export default function TopLevelLayout() {

    debugLogComponentRerender("TopLevelLayout");

    const [userDbDocRef, setUserDbDocRef] = useState<DocumentReference | null>(null);
    useEffect(
        () => {
            dbCheckAndGetUserAuthentication(
                (result: DocumentReference) => {
                    unsubFromUserDbListener();
                    setUserDbDocRef(result);
                },
                () => {
                    unsubFromUserDbListener();
                    setUserDbDocRef(null);
                }
            );
        },
        []
    );

    const [userDbDoc, setUserDbDoc] = useState<DocumentSnapshot | null>(null);
    useEffect(
        () => {
            if (userDbDocRef !== null) {
                const unsub: Unsubscribe = onSnapshot(userDbDocRef, async () => {
                    setUserDbDoc(await getDoc(userDbDocRef));
                });

                userDbListenerUnsub = unsub;
            }
        },
        [userDbDocRef]
    );

    return (
        <div className="grow flex flex-col justify-stretch items-stretch bg-dashboard_lime">
            {/* Sub pages (as defined in routes.ts) */}
            <Outlet context={{ userDbDoc: userDbDoc }} />
        </div>
    );
}

export type TopLevelLayoutContext = { userDbDoc: DocumentSnapshot | null };
export function useTopLevelLayoutContext(): TopLevelLayoutContext { return useOutletContext(); }
