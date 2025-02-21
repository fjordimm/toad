import React, { useState } from "react";
import { debugLogComponentRerender } from "~/src/debugUtil";
import NewExpense from "../modules/TripPageExpenses/NewExpense";

export default function Landing() {

    debugLogComponentRerender("LandingPage");

    // const mainLayoutContext: MainLayoutContext = useMainLayoutContext();

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="grow flex justify-center items-center bg-dashboard_lime">
            <p className="font-sunflower text-sidebar_deep_green text-xl text-center p-5">Select a trip on the side panel to continue or create new trip!</p>
            <button onClick={() => setIsModalOpen(true)} className="relative rounded-full h-7 w-7 flex items-center justify-center bg-[#4E6A55] text-white">+</button>
        

        {
        isModalOpen
            ? <NewExpense onClose={() => setIsModalOpen(false)} />
            : null
        }   
        </div>
    );
}
