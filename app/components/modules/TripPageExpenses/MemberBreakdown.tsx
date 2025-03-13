/*
 Description:
  A modal containing the expense breakdown as well as all the expenses, but only ones involving a specified member. This shows up when you click one of the names under 'View Expenses by Person'.
 
 Interactions:
  - Parent Component(s): TripPageExpenses
  - Direct Children Component(s): Expense
  - Database: none
*/

import type { DocumentSnapshot } from "firebase/firestore";
import React from "react";
import { useRef, useState } from 'react';
import type { TripMembersInfo } from "~/components/pages/TripPageLayout";
import Expense from "../../modules/TripPageExpenses/ExpenseList/Expense";

export default function MemberBreakdown(props: {memberEmail: string, memberFirstName: string, iOwePeople: string[], peopleOweMe: string[], currUser: string, expensesDict: any, tripMembersInfo: TripMembersInfo,  tripDbDoc: DocumentSnapshot | null, onClose: () => void}) {

    const modalContentRef = useRef<HTMLDivElement>(null);
    const [view, setView] = useState<"owe" | "owed">("owe");

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
            if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
                props.onClose();
            }
    };

    let iOwe:number = 0;
    let theyOwe:number = 0;
    let iOwePaid:number = 0;
    let theyOwePaid:number = 0;
    let iOweList:string[] = [];
    let theyOweList: string[] = [];
    for(const expense of props.iOwePeople) {
        if(props.expensesDict[expense]["expense_owner"] === props.memberEmail) {
            if(props.expensesDict[expense]["payers"][props.currUser][1] == 0) {
                iOwe += props.expensesDict[expense]["payers"][props.currUser][0];
            } else {
                iOwePaid += props.expensesDict[expense]["payers"][props.currUser][0];
            }
            iOweList.push(expense);
        }
    }
    for(const expense of props.peopleOweMe) {
        if(props.memberEmail in props.expensesDict[expense]["payers"]) {
            if(props.expensesDict[expense]["payers"][props.memberEmail][1] == 0) {
                theyOwe += props.expensesDict[expense]["payers"][props.memberEmail][0];
            } else {
                theyOwePaid += props.expensesDict[expense]["payers"][props.memberEmail][0];
            }
            theyOweList.push(expense);
        }
    }

    const iOweView = () => {
        return(<div className="flex flex-col gap-3 m-3" >
            {
                iOweList.map((expenseId: string) => {
                    if (props.tripDbDoc !== null) {
                        return (
                            <Expense key={expenseId} tripDbDoc={props.tripDbDoc} tripMembersInfo={props.tripMembersInfo} expenseId={expenseId} currUser={props.currUser}></Expense>
                        );
                    } else {
                        return null;
                    }
                })
            }
        </div>);
    }

    const theyOweView = () => {
        return(<div className="flex flex-col gap-3 m-3">
            {
                theyOweList.map((expenseId: string) => {
                    if (props.tripDbDoc !== null) {
                        return (
                            <Expense key={expenseId} tripDbDoc={props.tripDbDoc} tripMembersInfo={props.tripMembersInfo} expenseId={expenseId} currUser={props.currUser}></Expense>
                        );
                    } else {
                        return null;
                    }
                })
            }
        </div>);
    }

    return(
        // Blacking out the whole page
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50" onClick={handleOverlayClick}>
            {/* Modal itself */}
            <div ref={modalContentRef} className="relative flex flex-col w-2/3 justify-center items-center bg-dashboard_component_bg py-6 rounded-2xl px-6 mx-4" onClick={(e) => e.stopPropagation()}>
                
                {/* Total Owed Amounts */}
                <div className="flex flex-col justify-center w-full gap-y-4">
                    <div className="flex flex-row justify-center w-full">
                        <div className="flex w-1/2  bg-[#D7F297] p-2 rounded-xl mr-2 items-center justify-center">
                            <p className="font-sunflower text-2xl text-sidebar_deep_green">
                                    <b>You Owe {" "}{props.memberFirstName}{" "}</b>
                                    <span className="text-red-800">${iOwe.toFixed(2)}</span>
                            </p>
                        </div>
                        <div className="flex w-1/2  bg-[#D7F297] p-2 rounded-xl ml-2 justify-center items-center">
                            <p className="font-sunflower text-2xl text-sidebar_deep_green">
                                    <b>{props.memberFirstName}{" "}Owes You{" "}</b>
                                    <span className="text-red-800">${theyOwe.toFixed(2)}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-row justify-center w-full">
                        <div className="flex w-1/2  bg-[#D7F297] p-2 rounded-xl mr-2 items-center justify-center">
                            <p className="font-sunflower text-2xl text-sidebar_deep_green">
                                    <b>You have paid {" "}{props.memberFirstName}{" "}</b>
                                    <span className="text-red-800">${iOwePaid.toFixed(2)}</span>
                            </p>
                        </div>
                        <div className="flex w-1/2  bg-[#D7F297] p-2 rounded-xl ml-2 justify-center items-center">
                            <p className="font-sunflower text-2xl text-sidebar_deep_green">
                                    <b>{props.memberFirstName}{" "}Has Paid You{" "}</b>
                                    <span className="text-red-800">${theyOwePaid.toFixed(2)}</span>
                            </p>
                        </div>
                    </div>
                </div>
                {/* Background Decoration */}
                <div className="flex flex-col bg-[#D7F297] w-full mt-4 rounded-2xl h-96">
                    {/* Sorting Buttons */}
                    <div className="flex flex-row justify-center pt-0 max-h-9">
                        <div className="w-1/2 h-18">
                            <button onClick={() => setView("owe")} className={`w-full h-9 rounded-tl-2xl font-sunflower text-sidebar_deep_green text-xl hover:ring-[#FFF]/40 hover:ring-2 ${view === "owe" ? "bg-sidebar_deep_green/25" : "bg-sidebar_deep_green/10"} hover:bg-sidebar_deep_green/25`}>I Owe</button>
                        </div>
                        <div className="w-1/2 h-18">
                            <button onClick={() => setView("owed")} className={`w-full h-9 rounded-tr-2xl font-sunflower text-sidebar_deep_green text-xl hover:ring-[#FFF]/40 hover:ring-2 ${view === "owed" ? "bg-sidebar_deep_green/25" : "bg-sidebar_deep_green/10"} hover:bg-sidebar_deep_green/25`}>Owes Me</button>
                        </div>
                    </div>
                    <div className="overflow-auto scrollbar-thin flex flex-col gap-3 m-3">
                        {view == "owe" ? iOweView(): theyOweView()}
                    </div>
                </div>
            </div>
        </div>
    );



}