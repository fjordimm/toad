import { Link } from "react-router";
import React, { useState } from 'react';
import { updateDoc, type DocumentSnapshot } from 'firebase/firestore';
import ExpenseView from 'app/components/modules/TripPageExpenses/ExpenseView'
export default function BudgetPageMain(tripDbDoc: DocumentSnapshot| null) {

    const [view, setView] = useState<"all" | "owe" | "owed">("all");
    //const trips_sorted: any[] = tripDbDoc.data().trips_sorted;

    return(
        <div className="grow flex flex-col gap-5 bg-dashboard_lime">
            {/* Non button div */}
            <div className="">
                                <Link to="./.." className="bg-dashboard_component_bg py-2 px-4 rounded-lg font-sunflower text-sidebar_deep_green underline">Back</Link>
            </div>
            <div className = "flex flex-row gap-5 h-full">
                {/* Main Div */}
                <div className="grow flex flex-col w-4/5 gap-5 justify-between">
                    <div className="bg-[#D7F297] h-full rounded-xl gap-0">
                        {/* Buttons to Sort */}
                        <div className = "flex flex-row justify-center mt-2 w-full h-9 gap-x-3">
                            <button onClick={() => setView('all')} className = "w-1/5 rounded-lg h-full bg-black/15 hover:bg-black/35 font-sunflower text-sidebar_deep_green text-xl hover:ring-[#FFF]/40 hover:ring-2">All Expenses</button>
                            <button onClick={() => setView('owe')} className = "w-1/5 rounded-lg h-full bg-black/15 hover:bg-black/35 font-sunflower text-sidebar_deep_green text-xl hover:ring-[#FFF]/40 hover:ring-2">I Owe</button>
                            <button onClick={() => setView('owed')} className = "w-1/5 rounded-lg h-full bg-black/15 hover:bg-black/35 font-sunflower text-sidebar_deep_green text-xl hover:ring-[#FFF]/40 hover:ring-2">Owed to Me</button>
                        </div>
                        {/* By Default, display the "All Expenses" Otherwise, show the selected expenses */}
                        <div>
                            <ExpenseView view={view}></ExpenseView>
                        </div>
                    </div>
                </div>
                {/* Sidebar Div */}
                <div className="flex flex-col w-1/5 h-full gap-y-4">
                        <div className = "bg-[#D7F297] p-5 rounded-xl">
                            <p className = "font-sunflower font-bold text-3xl text-sidebar_deep_green">You owe all toads on board</p>
                            <p className = "font-sunflower font-bold text-3xl text-red-800">$513.26</p>
                        </div>
                        <div className = "bg-[#D7F297] p-5 rounded-xl">
                            <p className = "font-sunflower font-bold text-3xl text-sidebar_deep_green">Your fellow toads owe you</p>
                            <p className = "font-sunflower font-bold text-3xl text-red-800">$10.00</p>
                        </div>
                </div>
            </div>
        </div>
    );

}