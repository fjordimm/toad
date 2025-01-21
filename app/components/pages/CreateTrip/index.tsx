import React, { useState } from 'react';
import calendarIcon from '../../../assets/calendarIcon.svg'



const CreateApplication = () =>{

    const [tripName, setTripName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission behavior
        console.log({
            tripName: tripName,
            startDate: startDate,
            endDate: endDate
        });
    };


    return(
        <div className="mt-32">
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
                                    placeholder="End Date"
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

export default CreateApplication