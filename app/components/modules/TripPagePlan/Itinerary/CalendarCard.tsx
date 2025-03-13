/*
 Description:
  A card representing a single day of the itinerary. See Itinerary for more details.
 
 Interactions:
  - Parent Component(s): Itinerary
  - Direct Children Component(s): DestinationBox
  - Database: Firestore writes
*/

import React from "react";
import { useEffect, useRef, type ReactNode } from "react";
import { DocumentSnapshot, Timestamp, updateDoc } from "firebase/firestore";
import { useParams } from "react-router";
import stayAtIcon from "/stayAt.svg"
import { DestinationDroppable, SortableDestinationBox } from "~/components/pages/TripPagePlan";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import linkifyHtml from "linkify-html";
import { debugLogComponentRerender } from "~/src/debugUtil";

const options = {
    defaultProtocol: "https",
    attributes: {
        target: "_blank",
        rel: "noopener noreferrer",
        contentEditable: "false"
    },
    // Ensures that URLs without http(s) get prefixed appropriately
    formatHref: (href: string, type: string) => {
        if (type === "url" && !/^(?:https?|ftp):\/\//i.test(href)) {
            return "https://" + href;
        }
        return href;
    },
    // format: (value: string, type: string): string => {
    //     if (type === "url") {
    //       return value.replace(/^https?:\/\//, "");
    //     }
    //     return value;
    //   },
};

export default function CalendarCard(props: { dbIndex: number, activities: any[], day: Timestamp, stay_at: string, additional_notes: string, tripDbDoc: DocumentSnapshot, listOfDestinations: { [key: string]: any }, activeDraggableId: string | null }) {

    debugLogComponentRerender("CalendarCard");

    const { tripId } = useParams();
    // console.log("DBDoc ID: " + tripDbDoc?.id);

    // DATE HANDLER ===================================================
    // Interfaces with databse itinerary to get the display date of each card

    //Converts FireStore timestamp to JS date object
    const dateObject = props.day.toDate()

    const weekday = dateObject.toLocaleDateString("en-US", { weekday: "short" })   // Monday
    const month = dateObject.toLocaleDateString("en-US", { month: "short" })      // January
    const dayOfMonth = dateObject.getDate();                                       // 25
    const year = dateObject.getFullYear();                                          // 2025

    // ACCOMMADATION HANDLER ===========================================
    // Interfaces with database itinerary to get and save stay_at
    const stayAtRef = useRef<HTMLDivElement | null>(null);


    // ADDITIONAL NOTES HANDLER ========================================
    // Interfaces with database itinerary to get and save additional notes

    // Use REFs to avoid unecessary rerenders
    const contentRef = useRef<HTMLDivElement | null>(null);
    /*  
    SAVE: When user clicks out of the input box, save updated content to 
    additional_notes in the corresponding day in database 
    */

    const updateClickableUrls = () => {
        if (stayAtRef.current) {
            const textContent = stayAtRef.current.innerText;
            stayAtRef.current.innerHTML = linkifyHtml(textContent, options);
        }
        if (contentRef.current) {
            const textContent = contentRef.current.innerText;
            contentRef.current.innerHTML = linkifyHtml(textContent, options);
        }
    };

    const handleSave = async () => {
        if (props.tripDbDoc != null) {
            const tripData = props.tripDbDoc.data();
            try {
                if (tripData && tripData.itinerary) {
                    // Creates a soft copy of the `itinerary` array in database
                    const updatedItinerary = [...tripData.itinerary]

                    // Search through copy to find the index of the day of the notes user has edited
                    const itineraryIndex = updatedItinerary.findIndex(
                        (item: { day: Timestamp }) => item.day.isEqual(props.day)
                    );

                    if (itineraryIndex != -1) {

                        // Replace that array index with a dictionary where:
                        // All other fields stay the same, but additional_notes is replaced with new content (ANcontent)
                        updatedItinerary[itineraryIndex] = {
                            ...updatedItinerary[itineraryIndex],
                            additional_notes: contentRef.current?.innerText,
                            stay_at: stayAtRef.current?.innerText,
                        };

                        // Update database by replacing old itinerary with new copied array
                        await updateDoc(props.tripDbDoc.ref, {
                            itinerary: updatedItinerary,
                        });
                        updateClickableUrls();
                    }
                }
            } catch (e) {
                console.error("Error updating additional notes: ", e);
            }
        }
    };

    // Updates in useEffect only happens when there is a change to tripDbDoc or day
    // Updates current div only if new notes are saved - preventing unecessary rerenders

    useEffect(() => {
        if (props.tripDbDoc != null && props.tripDbDoc.id == tripId) {
            const tripData = props.tripDbDoc.data();
            if (tripData && tripData.itinerary) {
                const updatedNotes = tripData.itinerary.find(
                    (item: { day: Timestamp }) => item.day.isEqual(props.day)
                )?.additional_notes;

                const updatedStayAt = tripData.itinerary.find(
                    (item: { day: Timestamp }) => item.day.isEqual(props.day)
                )?.stay_at;


                // if additional_notes in database is updated - change content of div via ref
                if (contentRef.current && updatedNotes) {
                    // contentRef.current.innerText = updatedNotes;
                    contentRef.current.innerHTML = linkifyHtml(updatedNotes, options);
                }

                if (stayAtRef.current && updatedStayAt) {
                    stayAtRef.current.innerHTML = linkifyHtml(updatedStayAt, options);
                }
            }
        }
    }, [props.tripDbDoc]);

    useEffect(() => {
        const currentStayAt = stayAtRef.current;
        if (currentStayAt) {
            const clickHandler = (e: MouseEvent) => {
                const target = e.target as HTMLElement;
                if (target.tagName === "A") {
                    window.open((target as HTMLAnchorElement).href, "_blank");
                    e.preventDefault();
                }
            };
            currentStayAt.addEventListener("click", clickHandler);
            return () => currentStayAt.removeEventListener("click", clickHandler);
        }
    }, []);

    useEffect(() => {
        const currentNotes = contentRef.current;
        if (currentNotes) {
            const clickHandler = (e: MouseEvent) => {
                const target = e.target as HTMLElement;
                if (target.tagName === "A") {
                    window.open((target as HTMLAnchorElement).href, "_blank");
                    e.preventDefault();
                }
            };
            currentNotes.addEventListener("click", clickHandler);
            return () => currentNotes.removeEventListener("click", clickHandler);
        }
    }, []);

    function turnActivitiesIntoElems(activities: any[]): ReactNode {
        return (
            <div className="flex flex-col w-full">
                {
                    activities.map((activityId: string) => {
                        const activityObj: any = props.listOfDestinations[activityId];

                        return (
                            <SortableDestinationBox key={activityId} tripDbDoc={props.tripDbDoc} activeDraggableId={props.activeDraggableId} destinationId={activityId} destinationObj={activityObj} />
                        );
                    })
                }
            </div>
        );
    }

    return (
        <div className="w-full rounded-lg bg-itinerary_card_green p-2 flex">

            {/* Date and Accommadation Column */}
            <div className="flex flex-col justify-between w-40 border-r-2 border-dashboard_component_bg text-sidebar_deep_green p-2">

                <div>
                    <h1 className="font-sunflower text-3xl" style={{ fontWeight: 900 }}>
                        <b>{weekday}</b>
                    </h1>
                    <p>{month} {dayOfMonth}, {year}</p>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex gap-2 items-center">
                        <img src={stayAtIcon} alt="stayAt Icon" className="w-1/5 self-center"></img>
                        <p className="font-sunflower text-sidebar_deep_green align-middle"> Staying At: </p>
                    </div>

                    <div
                        contentEditable="true"
                        ref={stayAtRef}
                        className="custom-scrollbar font-sunflower border-b-2 max-h-24 overflow-x-auto border-sidebar_deep_green focus:outline-none"
                        onBlur={handleSave}
                        style={{ whiteSpace: "pre-wrap" }}
                    >
                        {props.stay_at}
                    </div>
                </div>
            </div>

            <SortableContext items={props.activities} strategy={verticalListSortingStrategy}>
                <DestinationDroppable id={`calendarcard_${props.dbIndex}`}>
                    <div className="grow w-96 px-3 font-sunflower flex items-start justify-center self-center justify-self-center">
                        {
                            props.activities.length > 0
                                ? turnActivitiesIntoElems(props.activities)
                                : <p className="grow self-center text-sidebar_deep_green max-w-48">Drag activities from Possible Stops to plan it for this day</p>
                        }
                    </div>
                </DestinationDroppable>
            </SortableContext>

            {/* Additional Notes column */}
            <div className="bg-toad_count_lime w-72 rounded-lg text-sidebar_deep_green">
                <div className="p-2">
                    <p className="font-sunflower text-md"><b>Additional Notes:</b></p>

                    {/* Editable textbox */}
                    <div
                        contentEditable="true"
                        ref={contentRef}
                        className="custom-scrollbar font-sunflower h-48 focus:outline-none break-words max-h-48 overflow-scroll"
                        onBlur={handleSave}
                        style={{ whiteSpace: "pre-wrap" }}
                    >
                        {props.additional_notes}
                    </div>
                </div>
            </div>
        </div>
    )
}
