/*
 Description:
  A modal that pops up when you create a new poll from a trip's main page.
 
 Interactions:
  - Parent Component(s): TripPageMain
  - Direct Children Component(s): none
  - Database: Firestore writes
*/

import React, { useEffect, useRef, useState } from "react";
import cross from "/cross.svg";
import DeletePoll from "/DeletePoll.svg";
import { useTripPageLayoutContext, type TripPageLayoutContext } from "app/components/pages/TripPageLayout";
import { dbAddPoll } from "~/src/databaseUtil";
import { debugLogComponentRerender } from "~/src/debugUtil";

export default function PollModal(props: { onClose: () => void }) {

    debugLogComponentRerender("PollModal");

    const modalContentRef = useRef<HTMLDivElement>(null);
    const tripPageLayoutContext: TripPageLayoutContext = useTripPageLayoutContext();

    // State Variables
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState<string[]>([]);
    const [error, setError] = useState<string>("");

    // Debugging: Log current options when they change
    useEffect(() => {
        console.log("Current options:", options);
    }, [options]);

    // Get Poll Owner Email
    const pollOwner = tripPageLayoutContext.userDbDoc.get("email");

    // Submit Poll
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        //  Validation Checks
        if (!title.trim() || options.length === 0 || options.some(opt => !opt.trim())) {
            alert("Please fill out all fields and add at least one valid poll option.");
            return;
        }

        //adding votes to db
        const votes: { [key: string]: string[] } = {};
        options.forEach(option => {
            votes[option] = []; // Maintain order
        });

        //  Save to Firestore
        if (tripPageLayoutContext.tripDbDoc) {
            await dbAddPoll(tripPageLayoutContext.tripDbDoc.ref, title, description, pollOwner, options, votes);
        }

        console.log("Poll added successfully");
        props.onClose();
    }

    // Add Poll Option
    const handleAddOption = () => {
        setOptions(prevOptions => [...prevOptions, ""]);
    };

    // Remove Poll Option
    const handleRemoveOption = (index: number) => {
        setOptions(prevOptions => {
            const newOptions = prevOptions.filter((_, i) => i !== index);
            validateDuplicateOptions(newOptions);
            return newOptions;
        })
    };

    // Update Poll Option
    const handleOptionChange = (index: number, value: string) => {
        setOptions(prevOptions => {
            const newOptions = prevOptions.map((opt, i) => (i === index ? value : opt));
            validateDuplicateOptions(newOptions);
            return newOptions;
        })
    };

    const validateDuplicateOptions = (options: string[]) => {
        const uniqueOptions = new Set(options);
        if (uniqueOptions.size < options.length) {
            setError("Error: options cannot have the same name");
        } else {
            setError("");
        }
    }

    // Handle Click Outside to Close Modal
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
            {/* Modal Container */}
            <div
                ref={modalContentRef}
                className="relative flex flex-col w-2/5 bg-dashboard_component_bg py-8 rounded-2xl gap-6"
                onClick={(e) => e.stopPropagation()}
            >

                {/* 🔹 Modal Header */}
                <div className="flex items-center justify-center px-4 h-10">
                    <p className="font-sunflower text-sidebar_deep_green text-2xl">
                        Add a Poll
                    </p>
                </div>

                {/* Close Button */}
                <div
                    className="absolute top-4 right-4 rounded-full h-10 w-10 flex items-center justify-center bg-sidebar_button_bg cursor-pointer"
                    onClick={props.onClose}
                >
                    <img src={cross} className="w-7 h-7" />
                </div>

                {/* Poll Form */}
                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">

                    {/* Poll Title Input */}
                    <div className="bg-sidebar_deep_green/15 py-4 px-8 w-11/12 rounded-2xl focus-within:ring-2 focus-within:ring-[#FFF]/40">
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Name of Poll"
                            className="w-full bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower border-b-2 border-[#FFF]/50 focus:outline-none"
                        />
                    </div>

                    {/* Poll Description */}
                    <div className="mt-5 bg-sidebar_deep_green/15 py-4 px-8 w-11/12 min-h-28 rounded-2xl focus-within:ring-2 focus-within:ring-[#FFF]/40">
                        <textarea
                            id="description"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            className="w-full bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower focus:outline-none focus:ring-0"
                        />
                    </div>

                    {/* Poll Options */}
                    <div className="w-11/12 bg-[#8FAE72] p-4 rounded-xl mt-4 h-[290px] overflow-y-auto scrollbar-none flex flex-col items-center">

                        {/* Add Poll Option Button */}
                        <button
                            type="button"
                            onClick={handleAddOption}
                            className="bg-[#769368] text-white text-sm font-sunflower px-4 py-1 rounded-md mb-4 w-[190px] text-center"
                        >
                            + Add a Poll Option
                        </button>

                        {/* List of Options */}
                        {options.map((option, index) => (
                            <div key={index} className="relative flex items-center w-full">

                                {/* Poll Option Input */}
                                <div className="flex-grow bg-[#EFDA53] p-2 rounded-md mt-2">
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        className="w-full bg-transparent text-black placeholder:text-black font-sunflower focus:outline-none"
                                        placeholder="Option Name"
                                    />
                                </div>

                                {/* Remove Option Button */}
                                <button type="button" onClick={() => handleRemoveOption(index)} className="ml-2 mt-2">
                                    <img src={DeletePoll} alt="Delete Poll Option" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {error && <div className="font-sunflower font-bold text-[#a30f22] p-2">{error}</div>}

                    {/* Submit Button */}
                    <div className="relative top-3 right-2 w-full flex justify-end pr-4">
                        <button type="submit" disabled={!!error} className="bg-[#8FAE72] text-white py-2 px-6 rounded-lg text-lg">
                            Done
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
