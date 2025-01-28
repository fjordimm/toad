import { Outlet, useOutletContext } from "react-router";
import type { Route } from "./+types/TopLevelLayout";
import { useEffect, useState } from "react";
import type { DocumentSnapshot } from "firebase/firestore";
import { authenticateUser } from "~/src/databaseUtil";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "TOAD" },
		{ name: "description", content: "To Outline A Destination" },
	];
}

export default function TopLevelLayout() {

	console.log("TOP LEVEL LAYOUT RERENDERING");

	const [stateChangeForcer, setStateChangeForcer] = useState<boolean>(false);
	function forceStateChange() {
		console.log("!!!!!!!!!!!!!!!!!!!!! forcing a state change");
		setStateChangeForcer(!stateChangeForcer);
	}

	const [userDbDoc, setUserDbDoc] = useState<DocumentSnapshot | null>(null);
	useEffect( // So that it only runs once
		() => {
			authenticateUser(
				(result: DocumentSnapshot) => {
					console.log("authenticate positive");
					setUserDbDoc(result);
				},
				() => {
					console.log("authenticate negative");
					setUserDbDoc(null);
				}
			);
		},
		[] // The empty array as the second argument of useEffect ensures it only runs once
	);

	return (
		<div className="grow flex flex-col justify-stretch items-stretch bg-dashboard_lime">
			{  }
			<Outlet context={{ userDbDoc: userDbDoc, stateChangeForcer: stateChangeForcer, forceStateChange: forceStateChange }}/>
		</div>
	);
}

export type TopLevelLayoutContext = { userDbDoc: DocumentSnapshot | null, stateChangeForcer: boolean, forceStateChange: () => null };
export function useTopLevelLayoutContext(): TopLevelLayoutContext { return useOutletContext(); }
