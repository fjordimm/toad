/*
 Description:
  A list of expenses to be used in the expenses page. It takes in three arrays of expense ids (expenses, peopleOweMe, iOwePeople) from TripPageExpenses.
 
 Interactions:
  - Parent Component(s): TripPageExpenses
  - Direct Children Component(s): Expense
  - Database: none
*/

import type { DocumentSnapshot } from "firebase/firestore";
import React from "react";
import Expense from "./ExpenseList/Expense";
import type { TripMembersInfo } from "~/components/pages/TripPageLayout";

export default function ExpenseList(props: { view: "all" | "owe" | "owed", filter: "all" | "paid" | "unpaid", expenses: string[], peopleOweMe: string[], iOwePeople: string[], tripDbDoc: DocumentSnapshot | null, tripMembersInfo: TripMembersInfo, expenses_dict: any, currentUser: string }) {

    if (props.view === "all") {
        const all_paid: string[] = [];
        const all_unpaid: string[] = [];

        for (const expense of props.expenses) {
            let paid = true;
            for (const payee in props.expenses_dict[expense].payers) {
                const [, paidStatus] = props.expenses_dict[expense].payers[payee];

                if (paidStatus === 0) {
                    paid = false;
                    break;
                }
            }
            if (paid) {
                all_paid.push(expense);
            } else {
                all_unpaid.push(expense);
            }
        }

        if (props.filter === "all") {
            // return (<p>All Expenses View ALL.</p>);
            if (props.expenses.length == 0) {
                return (
                    <div className="mt-48 flex justify-center items-center">
                        <p className="font-sunflower text-sidebar_deep_green text-xl text-center p-5">There are no expenses!</p>
                    </div>
                );
            } else {
                return (
                    <div className="flex flex-col gap-3 m-3">
                        {/* {props.expenses.map(expense => (
                            <Expense tripDbDoc={tripDbDoc} tripId={expense}></Expense>
                        ))} */}
                        {
                            props.expenses.map((expenseId: string) => {
                                if (props.tripDbDoc !== null) {
                                    return (
                                        <Expense key={expenseId} tripDbDoc={props.tripDbDoc} tripMembersInfo={props.tripMembersInfo} expenseId={expenseId} currUser={props.currentUser}></Expense>
                                    );
                                } else {
                                    return null;
                                }
                            })
                        }
                    </div>
                );
            }
        } else if (props.filter === "paid") {
            // return (<p>All Expenses View PAID.</p>);
            if (all_paid.length == 0) {
                return (
                    <div className="mt-48 flex justify-center items-center">
                        <p className="font-sunflower text-sidebar_deep_green text-xl text-center p-5">No expenses are fully paid off yet!</p>
                    </div>
                );
            } else {
                return (
                    <div className="flex flex-col gap-3 m-3">
                        {/* {props.expenses.map(expense => (
                            <Expense tripDbDoc={tripDbDoc} tripId={expense}></Expense>
                        ))} */}
                        {
                            all_paid.map((expenseId: string) => {
                                if (props.tripDbDoc !== null) {
                                    return (
                                        <Expense key={expenseId} tripDbDoc={props.tripDbDoc} tripMembersInfo={props.tripMembersInfo} expenseId={expenseId} currUser={props.currentUser}></Expense>
                                    );
                                } else {
                                    return null;
                                }
                            })
                        }
                    </div>
                );
            }
        } else if (props.filter === "unpaid") {
            // return (<p>All Expenses View UNPAID.</p>);
            if (all_unpaid.length == 0) {
                return (
                    <div className="mt-48 flex justify-center items-center">
                        <p className="font-sunflower text-sidebar_deep_green text-xl text-center p-5">Any expenses are fully paid off!</p>
                    </div>
                );
            } else {
                return (
                    <div className="flex flex-col gap-3 m-3">
                        {/* {props.expenses.map(expense => (
                            <Expense tripDbDoc={tripDbDoc} tripId={expense}></Expense>
                        ))} */}
                        {
                            all_unpaid.map((expenseId: string) => {
                                if (props.tripDbDoc !== null) {
                                    return (
                                        <Expense key={expenseId} tripDbDoc={props.tripDbDoc} tripMembersInfo={props.tripMembersInfo} expenseId={expenseId} currUser={props.currentUser}></Expense>
                                    );
                                } else {
                                    return null;
                                }
                            })
                        }
                    </div>
                );
            }
        }
    } else if (props.view == "owe") {
        const owe_paid: string[] = [];
        const owe_unpaid: string[] = [];

        for (const expense of props.iOwePeople) {
            // 'expense' is now something like "expense_id_1"
            if (props.expenses_dict[expense].payers[props.currentUser][1] === 1) {
                owe_paid.push(expense);
            } else {
                owe_unpaid.push(expense);
            }
        }

        if (props.filter === "all") {
            // return (<p>I Owe People View ALL.</p>);
            if (props.iOwePeople.length == 0) {
                return (
                    <div className="mt-48 flex justify-center items-center">
                        <p className="font-sunflower text-sidebar_deep_green text-xl text-center p-5">You owe no expenses!</p>
                    </div>
                );
            } else {
                return (
                    <div className="flex flex-col gap-3 m-3">
                        {/* {props.expenses.map(expense => (
                            <Expense tripDbDoc={tripDbDoc} tripId={expense}></Expense>
                        ))} */}
                        {
                            props.iOwePeople.map((expenseId: string) => {
                                if (props.tripDbDoc !== null) {
                                    return (
                                        <Expense key={expenseId} tripDbDoc={props.tripDbDoc} tripMembersInfo={props.tripMembersInfo} expenseId={expenseId} currUser={props.currentUser}></Expense>
                                    );
                                } else {
                                    return null;
                                }
                            })
                        }
                    </div>
                );
            }
        } else if (props.filter === "paid") {
            // return (<p>I Owe People View PAID.</p>);
            if (owe_paid.length == 0) {
                return (
                    <div className="mt-48 flex justify-center items-center">
                        <p className="font-sunflower text-sidebar_deep_green text-xl text-center p-5">No expenses you owe are fully paid off yet!</p>
                    </div>
                );
            } else {
                return (
                    <div className="flex flex-col gap-3 m-3">
                        {/* {props.expenses.map(expense => (
                            <Expense tripDbDoc={tripDbDoc} tripId={expense}></Expense>
                        ))} */}
                        {
                            owe_paid.map((expenseId: string) => {
                                if (props.tripDbDoc !== null) {
                                    return (
                                        <Expense key={expenseId} tripDbDoc={props.tripDbDoc} tripMembersInfo={props.tripMembersInfo} expenseId={expenseId} currUser={props.currentUser}></Expense>
                                    );
                                } else {
                                    return null;
                                }
                            })
                        }
                    </div>
                );
            }
        } else if (props.filter === "unpaid") {
            // return (<p>I Owe People View UNPAID.</p>);
            if (owe_unpaid.length == 0) {
                return (
                    <div className="mt-48 flex justify-center items-center">
                        <p className="font-sunflower text-sidebar_deep_green text-xl text-center p-5">Any expenses you owe are fully paid off!</p>
                    </div>
                );
            } else {
                return (
                    <div className="flex flex-col gap-3 m-3">
                        {/* {props.expenses.map(expense => (
                            <Expense tripDbDoc={tripDbDoc} tripId={expense}></Expense>
                        ))} */}
                        {
                            owe_unpaid.map((expenseId: string) => {
                                if (props.tripDbDoc !== null) {
                                    return (
                                        <Expense key={expenseId} tripDbDoc={props.tripDbDoc} tripMembersInfo={props.tripMembersInfo} expenseId={expenseId} currUser={props.currentUser}></Expense>
                                    );
                                } else {
                                    return null;
                                }
                            })
                        }
                    </div>
                );
            }
        }
    } else if (props.view == "owed") {

        const owed_paid: string[] = [];
        const owed_unpaid: string[] = [];

        for (const expense of props.peopleOweMe) {
            let paid = true;
            for (const payee in props.expenses_dict[expense].payers) {
                const [, paidStatus] = props.expenses_dict[expense].payers[payee];

                if (paidStatus === 0) {
                    paid = false;
                    break;
                }
            }
            if (paid) {
                owed_paid.push(expense);
            } else {
                owed_unpaid.push(expense);
            }
        }

        if (props.filter === "all") {
            // return (<p>People Owe Me ALL.</p>);
            if (props.peopleOweMe.length == 0) {
                return (
                    <div className="mt-48 flex justify-center items-center">
                        <p className="font-sunflower text-sidebar_deep_green text-xl text-center p-5">There are no expenses owed to you!</p>
                    </div>
                );
            } else {
                return (
                    <div className="flex flex-col gap-3 m-3">
                        {/* {props.expenses.map(expense => (
                            <Expense tripDbDoc={tripDbDoc} tripId={expense}></Expense>
                        ))} */}
                        {
                            props.peopleOweMe.map((expenseId: string) => {
                                if (props.tripDbDoc !== null) {
                                    return (
                                        <Expense key={expenseId} tripDbDoc={props.tripDbDoc} tripMembersInfo={props.tripMembersInfo} expenseId={expenseId} currUser={props.currentUser}></Expense>
                                    );
                                } else {
                                    return null;
                                }
                            })
                        }
                    </div>
                );
            }
        } else if (props.filter === "paid") {
            // return (<p>People Owe Me PAID.</p>);
            if (owed_paid.length == 0) {
                return (
                    <div className="mt-48 flex justify-center items-center">
                        <p className="font-sunflower text-sidebar_deep_green text-xl text-center p-5">No expenses owed to you are fully paid off yet!</p>
                    </div>
                );
            } else {
                return (
                    <div className="flex flex-col gap-3 m-3">
                        {/* {props.expenses.map(expense => (
                            <Expense tripDbDoc={tripDbDoc} tripId={expense}></Expense>
                        ))} */}
                        {
                            owed_paid.map((expenseId: string) => {
                                if (props.tripDbDoc !== null) {
                                    return (
                                        <Expense key={expenseId} tripDbDoc={props.tripDbDoc} tripMembersInfo={props.tripMembersInfo} expenseId={expenseId} currUser={props.currentUser}></Expense>
                                    );
                                } else {
                                    return null;
                                }
                            })
                        }
                    </div>
                );
            }
        } else if (props.filter === "unpaid") {
            // return (<p>People Owe Me UNPAID.</p>);
            if (owed_unpaid.length == 0) {
                return (
                    <div className="mt-48 flex justify-center items-center">
                        <p className="font-sunflower text-sidebar_deep_green text-xl text-center p-5">Any expenses owed to you are fully paid off!</p>
                    </div>
                );
            } else {
                return (
                    <div className="flex flex-col gap-3 m-3">
                        {/* {props.expenses.map(expense => (
                            <Expense tripDbDoc={tripDbDoc} tripId={expense}></Expense>
                        ))} */}
                        {
                            owed_unpaid.map((expenseId: string) => {
                                if (props.tripDbDoc !== null) {
                                    return (
                                        <Expense key={expenseId} tripDbDoc={props.tripDbDoc} tripMembersInfo={props.tripMembersInfo} expenseId={expenseId} currUser={props.currentUser}></Expense>
                                    );
                                } else {
                                    return null;
                                }
                            })
                        }
                    </div>
                );
            }
        }
    }
}
