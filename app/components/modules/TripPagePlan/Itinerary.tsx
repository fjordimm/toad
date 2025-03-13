/*
 Description:
  The left side of the plan page; a list of all days for the trip. Each day (CalendarCard) has a slot for 'Staying At', a slot for 'Additional Notes', and a list of all planned destinations.
 
 Interactions:
  - Parent Component(s): TripPagePlan
  - Direct Children Component(s): CalendarCard
  - Database: Firestore writes
*/

import React from "react";
import { useEffect, useState } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import CalendarCard from "./Itinerary/CalendarCard";
import { dbRetrieveTripItinerary } from "~/src/databaseUtil";
import { debugLogComponentRerender } from "~/src/debugUtil";

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

export default function Itinerary(props: { tripDbDoc: DocumentSnapshot, listOfDestinations: { [key: string]: any }, activeDraggableId: string | null }) {
    
    debugLogComponentRerender("Itinerary");
    
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
        <div className="flex flex-col gap-4">
            {itineraryList.map((item, index) => (
                <CalendarCard
                    key={index}
                    dbIndex={index}
                    activities={item.activities}
                    day={item.day}
                    stay_at={item.stay_at}
                    additional_notes={item.additional_notes}
                    tripDbDoc={props.tripDbDoc}
                    listOfDestinations={props.listOfDestinations}
                    activeDraggableId={props.activeDraggableId}
                />
            ))}
        </div>
    )
}
