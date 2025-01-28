import React, { useState } from "react";
import calendarIcon from "/calendarIcon.svg";
import {firebaseDb} from "../../src/toadFirebase";
import { collection, addDoc } from "firebase/firestore";
import { useMainLayoutContext, type MainLayoutContext } from "./MainLayout";

// TODO: error handling

const CreateTrip = () => {

	const mainLayoutContext: MainLayoutContext = useMainLayoutContext();

    const [tripName, setTripName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{

            // Add a trip to the 'trips' collection
            const tripRef = await addDoc(collection(firebaseDb, "trips"), {
                tripName: tripName,
                startDate: startDate,
                endDate: endDate,
                createdAt: new Date(), 
                tripOwner: mainLayoutContext.userDbDoc.data()?.email,
                days: Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)),
              });
            
            // Users Field
            await addDoc(collection(firebaseDb, "trips", tripRef.id, "trip_users"), {
                placeholder: "",      
            });
            // Invited Users Field
            await addDoc(collection(firebaseDb, "trips", tripRef.id, "invited_users"), {
                placeholder: "",      
            });

            // Itinerary
            await addDoc(collection(firebaseDb, "trips", tripRef.id, "trip_itinerary"), {
                placeholder: "",      
            });

            // Expenses
            await addDoc(collection(firebaseDb, "trips", tripRef.id, "expenses"), {
                placeholder: "",  
            });

            setTripName('');
            setStartDate('');
            setEndDate('');
        }
        catch (error) {
            console.error("Error adding trip: ", error);
        }
    };


    return(
        <div className="mt-32 grow">
            <div className="flex flex-col justify-center items-center gap-12">
                <p className="font-sunflower text-sidebar_deep_green text-3xl">Create Your Next Adventure</p>

                <div className="flex flex-col justify-center items-center bg-dashboard_component_bg py-8 w-3/5 rounded-2xl min-w-36 gap-4">
                    <p className="font-sunflower text-sidebar_deep_green text-md">You are the owner of the trip</p>
                    <form 
                        className="w-full px-12 flex flex-col gap-6"
                        onSubmit={handleSubmit}
                    >
                        {/* Name your trip */}
                        <div className="bg-sidebar_deep_green/15 py-4 px-8 rounded-2xl focus-within:ring-[#FFF]/40 focus-within:ring-2">
                            <input 
                                type="text" 
                                id="TripName" 
                                name="TripName" 
                                value={tripName}
                                required
                                placeholder="Name Your Trip"
                                onChange={(e) => setTripName(e.target.value)}
                                className="w-full min-w-32 bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower focus:outline-none focus:ring-0  border-b-2 border-[#FFF]/50"
                            />
                        </div>

                        {/* Select Dates */}
                        <div className='flex gap-4 items-center justify-center'>
                            <img src={calendarIcon} alt="calendarIcon"></img>
                            <div className="bg-sidebar_deep_green/15 py-4 px-8 rounded-2xl focus-within:ring-[#FFF]/40 focus-within:ring-2">
                                <input 
                                    type="date" 
                                    id="startDate" 
                                    name="startDate" 
                                    required
                                    value={startDate}
                                    placeholder="Start Date"
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-40 min-w-32 bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower focus:outline-none focus:ring-0  border-b-2 border-[#FFF]/50"
                                />
                            </div>
                            <p className='font-sunflower text-sidebar_deep_green text-lg'>to</p>
                            <div className="bg-sidebar_deep_green/15 py-4 px-8 rounded-2xl focus-within:ring-[#FFF]/40 focus-within:ring-2">
                                <input 
                                    type="date" 
                                    id="endDate" 
                                    name="endDate" 
                                    value={endDate}
                                    placeholder="End Date"
                                    required
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-40 min-w-32 bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower focus:outline-none focus:ring-0  border-b-2 border-[#FFF]/50"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            className='w-full bg-sidebar_deep_green/50 font-sunflower text-[#FFF]/80 py-4 rounded-2xl'
                            type='submit'
                        >
                            Begin
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateTrip