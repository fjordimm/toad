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
