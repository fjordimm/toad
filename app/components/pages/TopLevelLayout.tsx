import { Outlet, useOutletContext } from "react-router";
import type { Route } from "./+types/TopLevelLayout";
import { useEffect, useState } from "react";
import { getDoc, onSnapshot, type DocumentReference, type DocumentSnapshot } from "firebase/firestore";
import { dbCheckAndGetUserAuthentication } from "~/src/databaseUtil";
import { firebaseAuth } from "~/src/toadFirebase";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "TOAD" },
		{ name: "description", content: "To Outline A Destination" },
	];
}

export default function TopLevelLayout() {

	console.log("TOP LEVEL LAYOUT RERENDERING");

	const [userDbDocRef, setUserDbDocRef] = useState<DocumentReference | null>(null);
	useEffect(
		() => {
			dbCheckAndGetUserAuthentication(
				(result: DocumentReference) => {
					setUserDbDocRef(result);
				},
				() => {
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
				onSnapshot(userDbDocRef, async () => {
					setUserDbDoc(await getDoc(userDbDocRef));
				});
			}
		},
		[ userDbDocRef ]
	);

	return (
		<div className="grow flex flex-col justify-stretch items-stretch bg-dashboard_lime">
			<Outlet context={{ userDbDoc: userDbDoc }}/>
		</div>
	);
}

export type TopLevelLayoutContext = { userDbDoc: DocumentSnapshot | null };
export function useTopLevelLayoutContext(): TopLevelLayoutContext { return useOutletContext(); }
