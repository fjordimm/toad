/*
Instructions for use: 

This file, when implemented, will interact with TWO other files. Sidebar, and also TripLandingPage. 
***
TripLandingPage: 
***
//import the element
import AddDestination from '../modules/PlanPage/AddDestination';

//declare this inside the function 
const [isModalOpen, setIsModalOpen] = useState(false);

// this goes in the return statement wherever 
{isModalOpen && (
            <AddDestination 
            tripDbDoc={tripDbDoc}
            onClose={() => setIsModalOpen(false)}
            />

//wherever the sidebar is called, include code similar to this
//the idea is that you just have to pass in the parameter "onOpenModal={() => setIsModalOpen(true)}"
<ToadCount 
                tripDbDoc={tripDbDoc} 
                onOpenModal={() => setIsModalOpen(true)}
            />
***
PossibleStops.tsx
***

Inside the button element for "Add a Possible Destination", include: 
onClick={onOpenModal}

Additionally, you will have to pass in the function. So you will need to modify the function header to be something like:
type ToadCountProps = {
    tripDbDoc: DocumentSnapshot | null;
    onOpenModal: () => void;
};
const ToadCount: React.FC<ToadCountProps> = ({ tripDbDoc, onOpenModal }) => {
(i am using ToadCount as an example because that is where I included my button, but it will be different for PossibleStops)

*/

// AddDestination.tsx
import React from "react";
import { useRef, useState } from 'react';
import { updateDoc, type DocumentSnapshot } from 'firebase/firestore';
import cross from "/cross.svg";
import { dbAddDestination } from "~/src/databaseUtil";

export default function AddDestination(props: { tripDbDoc: DocumentSnapshot | null, onClose: () => void }) {

    const modalContentRef = useRef<HTMLDivElement>(null);

    const [destinationName, setDestinationName] = useState('');
    const [price, setPrice] = useState('');
    const [length, setLength] = useState('');
    const [timeOfDay, setTimeOfDay] = useState('');
    const [description, setDescription] = useState('');

    async function handleSubmitDestination(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (props.tripDbDoc !== null) {
            await dbAddDestination(
                props.tripDbDoc.ref,
                false,
                destinationName,
                (price === null || price === "" || price === " ") ? "Free" : price,
                length,
                timeOfDay,
                description
            );
        }
        props.onClose();
    }

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
            props.onClose();
        }
    };


    return (
        <div
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
            onClick={handleOverlayClick}
        >
            {/* Modal content container */}
            <div
                ref={modalContentRef}
                className="relative flex flex-col w-2/5 justify-center items-center bg-dashboard_component_bg py-8 rounded-2xl gap-6"
                // Stop click events from bubbling to the overlay
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative flex items-center justify-center px-4 h-12">
                    <p className="font-sunflower text-sidebar_deep_green text-2xl">
                        Add a Potential Destination
                    </p>
                </div>
                <div className="absolute top-4 right-4 rounded-full h-10 w-10 flex items-center justify-center bg-sidebar_button_bg" onClick={props.onClose}>
                    <img src={cross} className="w-7 h-7"></img>
                </div>


                {/* Form Container */}
                <form className="w-full flex flex-col justify-center items-center" onSubmit={handleSubmitDestination}>
                    {/* Destination Name Input */}
                    <div className="bg-sidebar_deep_green/15 py-4 px-8 w-11/12 rounded-2xl focus-within:ring-[#FFF]/40 focus-within:ring-2">
                        <input
                            type="text"
                            id="destinationName"
                            name="destinationName"
                            onChange={(e) => setDestinationName(e.target.value)}
                            required
                            placeholder="Destination Name"
                            className="w-full bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower focus:outline-none border-b-2 border-[#FFF]/50"
                        />
                    </div>
                    {/* Container Div for the three row inputs */}
                    <div className="w-full grid grid-cols-3 gap-y-4 gap-x-4 py-4 px-8">
                        <div className="bg-sidebar_deep_green/15 left-0 py-4 px-8 rounded-2xl focus-within:ring-[#FFF]/40 focus-within:ring-2">
                            <input
                                type="text"
                                id="price"
                                name="price"
                                onChange={(e) => setPrice(e.target.value)}
                                maxLength={14}
                                placeholder="Price"
                                className="w-full bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower focus:outline-none border-b-2 border-[#FFF]/50"
                            />
                        </div>
                        <div className="bg-sidebar_deep_green/15 py-4 px-8 rounded-2xl focus-within:ring-[#FFF]/40 focus-within:ring-2">
                            <input
                                type="text"
                                id="length"
                                name="length"
                                onChange={(e) => setLength(e.target.value)}
                                maxLength={14}
                                placeholder="Length"
                                className="w-full bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower focus:outline-none border-b-2 border-[#FFF]/50"
                            />
                        </div>
                        <div className="bg-sidebar_deep_green/15 right-0 py-4 px-8 rounded-2xl focus-within:ring-[#FFF]/40 focus-within:ring-2">
                            <input
                                type="text"
                                id="timeOfDay"
                                name="timeOfDay"
                                onChange={(e) => setTimeOfDay(e.target.value)}
                                maxLength={14}
                                placeholder="Time of Day"
                                className="w-full bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower focus:outline-none border-b-2 border-[#FFF]/50"
                            />
                        </div>
                    </div>
                    {/* Container Div for the Description */}
                    <div className="bg-sidebar_deep_green/15 py-4 px-8 w-11/12 min-h-28 rounded-2xl focus-within:ring-[#FFF]/40 focus-within:ring-2">
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Description"
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower focus:outline-none focus:ring-0"
                        />
                    </div>
                    {/* Save/Submit Button */}
                    <div className="flex justify-center w-11/12 mt-4">
                        <button
                            type="submit"
                            className="w-full bg-sidebar_deep_green/50 font-sunflower text-[#FFF]/80 py-4 rounded-2xl">
                            Save
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}
