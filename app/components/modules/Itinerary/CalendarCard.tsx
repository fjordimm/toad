import React, { useEffect, useState } from "react";
import { DocumentSnapshot, Timestamp , updateDoc} from "firebase/firestore";
import { setAnalyticsCollectionEnabled } from "firebase/analytics";

// Type declarations for CalendarCard
type CalendarCardProps = {
    activities: any[];  
    day: Timestamp;
    stay_at: string;
    additional_notes: string;
    tripDbDoc: DocumentSnapshot | null;
}

// CalendarCard creates SINGULAR itinerary card representing a single day

const CalendarCard: React.FC<CalendarCardProps> = ({activities, day, stay_at, additional_notes, tripDbDoc}) => {

// DATE HANDLER ===================================================
// Interfaces with databse itinerary to get the display date of each card

    //Converts FireStore timestamp to JS date object
    const dateObject = day.toDate()

    const weekday = dateObject.toLocaleDateString("en-US", { weekday: "short" })   // Monday
    const month = dateObject.toLocaleDateString( "en-US", { month: "short" })      // January
    const dayOfMonth = dateObject.getDate();                                       // 25
    const year = dateObject.getFullYear();                                          // 2025

// ADDITIONAL NOTES HANDLER ========================================
// Interfaces with database itinerary to get and save additional notes

    // React state to store and update AdditonalNotes content. Default Value: parameter additional_notes
    const [ANcontent, setANcontent] = useState(additional_notes);

    // Extract text from the HTML div this is called from (user input text), sets ANcontent
    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        setANcontent(e.currentTarget.innerText);
    }

    /*  
    SAVE: When user clicks out of the input box, save updated content to 
    additional_notes in the corresponding day in database 
    */
    const handleSave = async () => {
        if (tripDbDoc != null){
            const tripData = tripDbDoc.data();
            try{
                if(tripData && tripData.itinerary){

                    // Creates a soft copy of the `itinerary` array in database
                    const updatedItinerary = [...tripData.itinerary]
                    
                    // Search through copy to find the index of the day of the notes user has edited
                    const itineraryIndex = updatedItinerary.findIndex(
                        (item: {day: Timestamp}) => item.day.isEqual(day)
                    );

                    if(itineraryIndex != -1){

                        // Replace that array index with a dictionary where:
                        // All other fields stay the same, but additional_notes is replaced with new content (ANcontent)
                        updatedItinerary[itineraryIndex] = {
                            ...updatedItinerary[itineraryIndex],
                            additional_notes: ANcontent,
                        };

                        // Update database by replacing old itinerary with new copied array
                        await updateDoc(tripDbDoc.ref, {
                            itinerary: updatedItinerary,
                        });
                        
                        console.log("Firestore updated additional notes");
                    }
                }
            }catch(e){
                console.error("Error updating additional notes: ", e);
            }
        }
    };

    useEffect(() =>{
        if (tripDbDoc != null){
            const tripData = tripDbDoc.data();
            if(tripData && tripData.itinerary){
                const updatedNotes = tripData.itinerary.find(
                    (item: {day: Timestamp}) => item.day.isEqual(day)
                )?.additional_notes;

                console.log(updatedNotes)

                if(updatedNotes)
                    setANcontent(updatedNotes);
            }
        }
    }, [tripDbDoc, day]);



    return (
        <div className="w-full h-64 rounded-lg bg-itinerary_card_green p-2 flex">

            {/* Date and Accommadation Column */}
            <div className="w-40 border-r-2 border-dashboard_component_bg text-sidebar_deep_green p-2">
                <h1 className="font-sunflower text-3xl" style={{ fontWeight: 900 }}>
                    <b>{weekday}</b>
                </h1>
                <p>{month} {dayOfMonth}, {year}</p>
            </div>

            {/* Draggable activities column */}
            <div className="w-96 font-sunflower flex items-center justify-center ">
                <p className="text-sidebar_deep_green max-w-48">Drag activities from Possible Stops to plan it for this day</p>
            </div>

            {/* Additional Notes column */}
            <div className="bg-toad_count_lime w-72 rounded-lg text-sidebar_deep_green">
                <div className="p-2">
                    <p className="font-sunflower text-md"><b>Additional Notes:</b></p>

                    {/* Editable textbox */}
                    <div 
                        contentEditable="true" 
                        className="font-sunflower h-48 focus:outline-none"
                        onInput={handleInput}
                        onBlur={handleSave}
                        style={{ whiteSpace: "pre-wrap"}}
                    >
                        <p>{additional_notes}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CalendarCard