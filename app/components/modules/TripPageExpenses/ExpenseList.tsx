/*
This component is what displays the various view of expenses for TripPageExpenses. 
It takes in a view (which is changed when the button in TripPageExpenses is clicked) as a prop
It also takes in the props expenses, peopleOweMe, iOwePeople as three different arrays
These arrays are uuids for expenses and will be used to generate the Expense components. 
*/

import React from "react";

export default function ExpenseView(props: { view: "all" | "owe" | "owed", expenses: string[], peopleOweMe: string[], iOwePeople: string[]}) {

  if(props.view === "all") {
    // return (
    //   <>
    //   {props.expenses.map(expense => (
    //   <Expense uuid={expense}></Expense>
    //   ))}
    //   </>
    // );
    return(<p>All Expenses View.</p>);
  } else if(props.view == "owe") {
    // return (
    //   <>
    //   {props.iOwePeople.map(expense => (
    //   <Expense uuid={expense}></Expense>
    //   ))}
    //   </>
    // );
    return(<p>I Owe People View.</p>);
  } else if(props.view == "owed") {
    // return (
    //   <>
    //   {props.peopleOweMe.map(expense => (
    //   <Expense uuid={expense}></Expense>
    //   ))}
    //   </>
    // );
    return(<p>People Owe Me View.</p>);
  }
}
