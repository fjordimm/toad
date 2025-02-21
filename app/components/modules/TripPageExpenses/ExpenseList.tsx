import React from "react";

export default function ExpenseView(props: { view: "all" | "owe" | "owed" }) {
  let displayText = "";
  if (props.view === "all") {
    displayText = "All Expenses";
  } else if (props.view === "owe") {
    displayText = "I Owe";
  } else if (props.view === "owed") {
    displayText = "Owed to me";
  }

  return <p>{displayText}</p>;
}
