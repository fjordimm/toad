import React, { useEffect, useState } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import CalendarCard from "../Itinerary/CalendarCard";
import { dbRetrieveTripItinerary } from "~/src/databaseUtil";
import { index } from "@react-router/dev/routes";

type ItineraryProps = {
    tripDbDoc: DocumentSnapshot | null;
}

/*
retrieveItinerary: retrieves itinerary field from trip database as array of dict days
params: tripDbDoc: DocumentSnapshot of current trip
returns: Array[{activities:... day:... stay_at: ... additional_notes:...}]
*/
async function retrieveItinerary(tripDbDoc: DocumentSnapshot){
    const ItineraryDaysList = await dbRetrieveTripItinerary(tripDbDoc);
    console.log("Retrieving Trip: " + tripDbDoc.id + "Content: "+ ItineraryDaysList);
    return ItineraryDaysList || null;
}

export default function Itinerary({tripDbDoc}: ItineraryProps){
    const [ItineraryList, setItineraryList] = useState<any[]>([]);

    useEffect(()=>{
        if (tripDbDoc){
            const fetchItinerary = async () => {
                const itinerary = await retrieveItinerary(tripDbDoc);
                if(Array.isArray(itinerary))
                    setItineraryList(itinerary || null);
            };
            fetchItinerary();
        }
        else{
            setItineraryList([]);
        }
    }, [tripDbDoc])


    return(
        <div className="flex flex-col gap-4 max-h-screen overflow-y-auto">
            {ItineraryList.map((item, index) =>(
                <CalendarCard 
                    key={index} 
                    activities={item.activities} 
                    day={item.day} 
                    stay_at={item.stay_at} 
                    additional_notes={item.additional_notes} 
                    tripDbDoc={tripDbDoc}
                />
            ))}
        </div>
    )
} 