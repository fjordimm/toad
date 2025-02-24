/*
TripPageExpenses.tsx is a mostly standalone component; it is referenced in routes.tsx once.
This file is the main overview for all expenses. There are three separate tabs for different expense views.
When clicked, these tabs display all expenses for that view via ExpenseList.tsx.
*/

import { Link } from "react-router";
import React, { useState } from 'react';
import { updateDoc, type DocumentSnapshot } from 'firebase/firestore';
import ExpenseView from '~/components/modules/TripPageExpenses/ExpenseList'
import { useTripPageLayoutContext, type TripPageLayoutContext } from "./TripPageLayout";
export default function BudgetPageMain() {

    const [view, setView] = useState<"all" | "owe" | "owed">("all");
    const [filter, setFilter] = useState<"all" | "paid" | "unpaid">("all");
    const tripPageLayoutContext: TripPageLayoutContext = useTripPageLayoutContext();
    const currUser: string = tripPageLayoutContext.userDbDoc.get("email");
    //const tripName = tripPageLayoutContext.tripDbDoc.get("expenses_sorted");
    const expenses = tripPageLayoutContext.tripDbDoc.get("expenses");
    //const expenses_sorted: string[] = tripPageLayoutContext.tripDbDoc.get("expenses_sorted");
    const expenses_sorted: string[] = Object.keys(expenses).sort((a, b) => {
        const dateA = new Date(expenses[a].date);
        const dateB = new Date(expenses[b].date);
        return dateB.getTime() - dateA.getTime();
    });

    let peopleOweMe: string[] = [];
    let iOwePeople: string[] = [];

    // populating the arrays
    for (let i = 0; i < expenses_sorted.length; i++) {
        if (expenses[expenses_sorted[i]]["expense_owner"] === currUser) {
            peopleOweMe.push(expenses_sorted[i]);
        }
        if (currUser in expenses[expenses_sorted[i]]["payers"] && expenses[expenses_sorted[i]]["expense_owner"] !== currUser) {
            iOwePeople.push(expenses_sorted[i]);
        }

    }

    // summing the values for the sidebar 
    let toads_owe_me: number = 0;
    let toads_paid_me: number = 0;
    let i_owe_toads: number = 0;
    for (let i = 0; i < iOwePeople.length; i++) {
        if (expenses[iOwePeople[i]]["payers"][currUser][1] == 0) {
            i_owe_toads += expenses[iOwePeople[i]]["payers"][currUser][0];
        }
    }
    for (let i = 0; i < peopleOweMe.length; i++) {
        for (const payee in expenses[peopleOweMe[i]]["payers"]) {
            if (payee == currUser) {
                continue;
            }
            if (expenses[peopleOweMe[i]]["payers"][payee][1] == 0) {
                toads_owe_me += expenses[peopleOweMe[i]]["payers"][payee][0];
            }
            if (expenses[peopleOweMe[i]]["payers"][payee][1] == 1) {
                toads_paid_me += expenses[peopleOweMe[i]]["payers"][payee][0];
            }
        }
    }

    return (
        <div className="grow flex flex-col gap-5 bg-dashboard_lime">
            {/* Non button div */}
            <div className="mt-[3px]">
                <Link to="./.." className="bg-dashboard_component_bg py-2 px-4 rounded-lg font-sunflower text-sidebar_deep_green underline">Back</Link>
            </div>
            <div className="flex flex-row gap-5 h-full">
                {/* Main Div */}
                <div className="grow flex flex-col w-4/5 gap-5 justify-between">
                    <div className="bg-[#D7F297] h-full rounded-xl">
                        {/* Buttons to Sort */}
                        <div className="flex flex-row justify-center -mt-2 w-full max-h-18">
                        <div className="flex justify-center mt-2 w-full gap-x-0 max-h-18 mb-10">
                            {/* All Expenses Button and Filters */}
                            <div className="relative w-1/3 h-18">
                                <button onClick={() => setView("all")}className={`w-full h-9 rounded-tl-xl font-sunflower text-sidebar_deep_green text-xl hover:ring-[#FFF]/40 hover:ring-2 ${view === "all" ? "bg-sidebar_deep_green/25" : "bg-sidebar_deep_green/10"} hover:bg-sidebar_deep_green/25`}>All Expenses</button>
                                {view === "all" && (
                                <div className="absolute top-full left-0 w-full flex justify-center">
                                    <button onClick={() => setFilter("all")}className={`w-1/3 h-9 font-sunflower text-sidebar_deep_green text-xl ${filter === "all" ? "bg-sidebar_deep_green/25" : "bg-sidebar_deep_green/10"} hover:ring-[#FFF]/40 hover:ring-2 hover:bg-sidebar_deep_green/25`}>All</button>
                                    <button onClick={() => setFilter("paid")}className={`w-1/3 h-9 font-sunflower text-sidebar_deep_green text-xl ${filter === "paid" ? "bg-sidebar_deep_green/25" : "bg-sidebar_deep_green/10"} hover:ring-[#FFF]/40 hover:ring-2 hover:bg-sidebar_deep_green/25`}>Paid</button>
                                    <button onClick={() => setFilter("unpaid")}className={`w-1/3 h-9 rounded-br-lg font-sunflower text-sidebar_deep_green text-xl ${filter === "unpaid" ? "bg-sidebar_deep_green/25" : "bg-sidebar_deep_green/10"} hover:ring-[#FFF]/40 hover:ring-2 hover:bg-sidebar_deep_green/25`}>Unpaid</button>
                                </div>
                                )}
                            </div>

                            {/* I Owe Button and Filters */}
                            <div className="relative w-1/3">
                                <button onClick={() => setView("owe")}className={`w-full h-9 font-sunflower text-sidebar_deep_green text-xl hover:ring-[#FFF]/40 hover:ring-2 ${view === "owe" ? "bg-sidebar_deep_green/25" : "bg-sidebar_deep_green/10"} hover:bg-sidebar_deep_green/25`}>I Owe</button>
                                {view === "owe" && (
                                <div className="absolute top-full left-0 w-full flex justify-center">
                                    <button onClick={() => setFilter("all")}className={`w-1/3 h-9 rounded-bl-lg font-sunflower text-sidebar_deep_green text-xl ${filter === "all" ? "bg-sidebar_deep_green/25" : "bg-sidebar_deep_green/10"} hover:ring-[#FFF]/40 hover:ring-2 hover:bg-sidebar_deep_green/25`}>All</button>
                                    <button onClick={() => setFilter("paid")}className={`w-1/3 h-9 font-sunflower text-sidebar_deep_green text-xl ${filter === "paid" ? "bg-sidebar_deep_green/25" : "bg-sidebar_deep_green/10"} hover:ring-[#FFF]/40 hover:ring-2 hover:bg-sidebar_deep_green/25`}>Paid</button>
                                    <button onClick={() => setFilter("unpaid")}className={`w-1/3 h-9 rounded-br-lg font-sunflower text-sidebar_deep_green text-xl ${filter === "unpaid" ? "bg-sidebar_deep_green/25" : "bg-sidebar_deep_green/10"} hover:ring-[#FFF]/40 hover:ring-2 hover:bg-sidebar_deep_green/25`}>Unpaid</button>
                                </div>
                                )}
                            </div>

                            {/* Owed to Me Button and Filters */}
                            <div className="relative w-1/3">
                                <button onClick={() => setView("owed")}className={`w-full h-9 rounded-tr-xl font-sunflower text-sidebar_deep_green text-xl hover:ring-[#FFF]/40 hover:ring-2 ${view === "owed" ? "bg-sidebar_deep_green/25" : "bg-sidebar_deep_green/10"} hover:bg-sidebar_deep_green/25`}>Owed to Me</button>
                                {view === "owed" && (
                                <div className="absolute top-full left-0 w-full flex justify-center">
                                    <button onClick={() => setFilter("all")}className={`w-1/3 h-9 rounded-bl-lg font-sunflower text-sidebar_deep_green text-xl ${filter === "all" ? "bg-sidebar_deep_green/25" : "bg-sidebar_deep_green/10"} hover:ring-[#FFF]/40 hover:ring-2 hover:bg-sidebar_deep_green/25`}>All</button>
                                    <button onClick={() => setFilter("paid")}className={`w-1/3 h-9 font-sunflower text-sidebar_deep_green text-xl ${filter === "paid" ? "bg-sidebar_deep_green/25" : "bg-sidebar_deep_green/10"} hover:ring-[#FFF]/40 hover:ring-2 hover:bg-sidebar_deep_green/25`}>Paid</button>
                                    <button onClick={() => setFilter("unpaid")}className={`w-1/3 h-9 font-sunflower text-sidebar_deep_green text-xl ${filter === "unpaid" ? "bg-sidebar_deep_green/25" : "bg-sidebar_deep_green/10"} hover:ring-[#FFF]/40 hover:ring-2 hover:bg-sidebar_deep_green/25`}>Unpaid</button>
                                </div>
                                )}
                            </div>
                        </div>
                        </div>
                        {/* By Default, display the "All Expenses" Otherwise, show the selected expenses */}
                        <div className = "">
                            <ExpenseView view={view} filter = {filter} expenses={expenses_sorted} iOwePeople={iOwePeople} peopleOweMe={peopleOweMe} tripDbDoc={tripPageLayoutContext.tripDbDoc} expenses_dict = {expenses} currentUser = {currUser}></ExpenseView>
                        </div>
                    </div>
                </div>
                {/* Sidebar Div */}
                <div className="flex flex-col w-1/5 h-full gap-y-4">
                    <div className="bg-[#D7F297] p-5 rounded-xl">
                        <p className="font-sunflower text-2xl text-sidebar_deep_green"><b>You owe all toads on board</b></p>
                        <p className="font-sunflower text-2xl text-red-800">${i_owe_toads.toFixed(2)}</p>
                    </div>
                    <div className="bg-[#D7F297] p-5 rounded-xl">
                        <p className="font-sunflower text-2xl text-sidebar_deep_green"><b>Your fellow toads owe you</b></p>
                        <p className="font-sunflower text-2xl text-red-800">${toads_owe_me.toFixed(2)}</p>
                    </div>
                    <div className="bg-[#D7F297] p-5 rounded-xl">
                        <p className="font-sunflower text-2xl text-sidebar_deep_green">
                            <b>Your fellow toads have paid you </b>
                            <span className="text-red-800">${toads_paid_me.toFixed(2)}</span>
                        </p>
                    </div>
                    <button className="bg-sidebar_deep_green rounded-xl p-2 font-sunflower text-white text-2xl">
                        Add an Expense
                    </button>
                </div>
            </div>
        </div>
    );

}