import React, { useEffect, useState } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import CalendarCard from "../Itinerary/CalendarCard";
import { dbRetrieveTripItinerary } from "~/src/databaseUtil";
import { index } from "@react-router/dev/routes";

/*
retrieveItinerary: retrieves itinerary field from trip database as array of dict days
params: tripDbDoc: DocumentSnapshot of current trip
returns: Array[{activities:... day:... stay_at: ... additional_notes:...}]
*/
async function retrieveItinerary(tripDbDoc: DocumentSnapshot) {
	const itineraryDaysList = await dbRetrieveTripItinerary(tripDbDoc);
	// console.log("Retrieving Trip: " + tripDbDoc.id + "Content: " + ItineraryDaysList);
	return itineraryDaysList || null;
}

export default function Itinerary(props: { tripDbDoc: DocumentSnapshot, listOfDestinations: { [key: string]: any } }) {
	const [itineraryList, setItineraryList] = useState<any[]>([]);

	useEffect(() => {
		if (props.tripDbDoc) {
			const fetchItinerary = async () => {
				const itinerary = await retrieveItinerary(props.tripDbDoc);
				if (Array.isArray(itinerary))
					setItineraryList(itinerary || null);
			};
			fetchItinerary();
		}
		else {
			setItineraryList([]);
		}
	}, [props.tripDbDoc])


	return (
		<div className="flex flex-col gap-4 overflow-y-auto">
			{itineraryList.map((item, index) => (
				<CalendarCard
					key={index}
					activities={item.activities}
					day={item.day}
					stay_at={item.stay_at}
					additional_notes={item.additional_notes}
					tripDbDoc={props.tripDbDoc}
					listOfDestinations={props.listOfDestinations}
				/>
			))}
		</div>
	)
}
