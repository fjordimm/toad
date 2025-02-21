/*
This component is what displays the various view of expenses for TripPageExpenses. 
It takes in a view (which is changed when the button in TripPageExpenses is clicked) as a prop
It also takes in the props expenses, peopleOweMe, iOwePeople as three different arrays
These arrays are uuids for expenses and will be used to generate the Expense components. 
*/

import type { DocumentSnapshot } from "firebase/firestore";
import React from "react";


export default function ExpenseList(props: { view: "all" | "owe" | "owed", expenses: string[], peopleOweMe: string[], iOwePeople: string[], tripDbDoc: DocumentSnapshot | null }) {

    if (props.view === "all") {
        // return (
        //   <div className = "flex flex-col gap-5 mx-3">
        //   {props.expenses.map(expense => (
        //   <Expense tripDbDoc = {tripDbDoc} tripId={expense}></Expense>
        //   ))}
        //   </div>
        // );
        return (<p>All Expenses View.</p>);
    } else if (props.view == "owe") {
        // return (
        //   <div className = "flex flex-col gap-5 mx-3">
        //   {props.iOwePeople.map(expense => (
        //   <Expense tripDbDoc = {tripDbDoc} tripId={expense}></Expense>
        //   ))}
        //   </div>
        // );
        return (<p>I Owe People View.</p>);
    } else if (props.view == "owed") {
        // return (
        //   <div className = "flex flex-col gap-5 mx-3">
        //   {props.peopleOweMe.map(expense => (
        //   <Expense tripDbDoc = {tripDbDoc} tripId={expense}></Expense>
        //   ))}
        //   </div>
        // );
        return (<p>People Owe Me View.</p>);
    }
}
