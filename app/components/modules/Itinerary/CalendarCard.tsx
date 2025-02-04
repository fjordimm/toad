import React, { useEffect, useState } from "react";

// Type declarations for 'date' parameter
type CalendarCardProps = {
    date: Date
}

// CalendarCard takes in an input - creates SINGULAR itinerary card representing a single day
// date: of type Date (javascript date) -----> Extracted from start to end date in trip database

const CalendarCard: React.FC<CalendarCardProps> = ({ date }) => {

    const weekday = date.toLocaleDateString("en-US", { weekday: "short" })   // Monday
    const month = date.toLocaleDateString( "en-US", { month: "short" })      // January
    const day = date.getDate();                                             // 25
    const year = date.getFullYear();                                        // 2025

    return (
        <div className="w-full h-64 rounded-lg bg-itinerary_card_green p-2 flex">

            {/* Date and Accommadation Column */}
            <div className="w-40 border-r-2 border-dashboard_component_bg text-sidebar_deep_green p-2">
                <h1 className="font-sunflower text-3xl" style={{ fontWeight: 900 }}>
                    <b>{weekday}</b>
                </h1>
                <p>{month} {day}, {year}</p>
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
                    <div contentEditable="true" className="font-sunflower h-48 focus:outline-none"></div>
                </div>
            </div>
        </div>
    )
}

export default CalendarCard