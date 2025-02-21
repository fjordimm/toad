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
    const tripPageLayoutContext: TripPageLayoutContext = useTripPageLayoutContext();
    const currUser:string = tripPageLayoutContext.userDbDoc.get("email");
    //const tripName = tripPageLayoutContext.tripDbDoc.get("expenses_sorted");
    const expenses = tripPageLayoutContext.tripDbDoc.get("expenses");
    const expenses_sorted: string[] = tripPageLayoutContext.tripDbDoc.get("expenses_sorted");
    let peopleOweMe: string[] = [];
    let iOwePeople: string[] = [];

    // populating the arrays
    for(let i = 0; i < expenses_sorted.length; i++) {
        if(expenses[expenses_sorted[i]]["expense_owner"] === currUser) {
        peopleOweMe.push(expenses_sorted[i]);
        }
        if(currUser in expenses[expenses_sorted[i]]["payers"] && expenses[expenses_sorted[i]]["expense_owner"] !== currUser) {
        iOwePeople.push(expenses_sorted[i]);
        }

    }

    // summing the values for the sidebar 
    let toads_owe_me:number = 0;
    let toads_paid_me:number = 0;
    let i_owe_toads:number = 0;
    for(let i = 0; i < iOwePeople.length; i++) {
        if(expenses[iOwePeople[i]]["payers"][currUser][1] == 0) {
            i_owe_toads += expenses[iOwePeople[i]]["payers"][currUser][0];
        }
    }
    for(let i = 0; i < peopleOweMe.length; i++) {
        for(const payee in expenses[peopleOweMe[i]]["payers"]) {
            if(payee == currUser) {
                continue;
            }
            if(expenses[peopleOweMe[i]]["payers"][payee][1] == 0) {
                toads_owe_me += expenses[peopleOweMe[i]]["payers"][payee][0];
            }
            if(expenses[peopleOweMe[i]]["payers"][payee][1] == 1) {
                toads_paid_me += expenses[peopleOweMe[i]]["payers"][payee][0];
            }
        }
    }

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
                        <div className = "flex flex-row justify-center mt-2 w-full h-9">
                            <button onClick={() => setView('all')} className = "mx-3 w-1/3 rounded-lg h-full bg-black/10 hover:bg-black/25 font-sunflower text-sidebar_deep_green text-xl hover:ring-[#FFF]/40 hover:ring-2">All Expenses</button>
                            <button onClick={() => setView('owe')} className = "w-1/3 rounded-lg h-full bg-black/10 hover:bg-black/25 font-sunflower text-sidebar_deep_green text-xl hover:ring-[#FFF]/40 hover:ring-2">I Owe</button>
                            <button onClick={() => setView('owed')} className = "mx-3 w-1/3 rounded-lg h-full bg-black/10 hover:bg-black/25 font-sunflower text-sidebar_deep_green text-xl hover:ring-[#FFF]/40 hover:ring-2">Owed to Me</button>
                        </div>
                        {/* By Default, display the "All Expenses" Otherwise, show the selected expenses */}
                        <div>
                            <ExpenseView view={view} expenses = {expenses_sorted} iOwePeople = {iOwePeople} peopleOweMe = {peopleOweMe}></ExpenseView>
                        </div>
                    </div>
                </div>
                {/* Sidebar Div */}
                <div className="flex flex-col w-1/5 h-full gap-y-4">
                        <div className = "bg-[#D7F297] p-5 rounded-xl">
                            <p className = "font-sunflower text-3xl text-sidebar_deep_green"><b>You owe all toads on board</b></p>
                            <p className = "font-sunflower text-3xl text-red-800">${i_owe_toads.toFixed(2)}</p>
                        </div>
                        <div className = "bg-[#D7F297] p-5 rounded-xl">
                            <p className = "font-sunflower text-3xl text-sidebar_deep_green">Your fellow toads owe you</p>
                            <p className = "font-sunflower text-3xl text-red-800">${toads_owe_me.toFixed(2)}</p>
                        </div>
                        <div className = "bg-[#D7F297] p-5 rounded-xl">
                            <p className = "font-sunflower text-3xl text-sidebar_deep_green">Your fellow toads have paid you</p>
                            <p className = "font-sunflower text-3xl text-red-800">${toads_paid_me.toFixed(2)}</p>
                        </div>
                        <button className="bg-sidebar_deep_green rounded-xl p-2 font-sunflower text-white text-2xl">
                            Add an Expense
                        </button>
                </div>
            </div>
        </div>
    );

}