/*
This component is what displays the various view of expenses for TripPageExpenses. 
It takes in a view (which is changed when the button in TripPageExpenses is clicked) as a prop
It also takes in the props expenses, peopleOweMe, iOwePeople as three different arrays
These arrays are uuids for expenses and will be used to generate the Expense components. 
*/

import type { DocumentSnapshot } from "firebase/firestore";
import React from "react";
import Expense from "./ExpenseList/Expense";
import type { TripMembersInfo } from "~/components/pages/TripPageLayout";


export default function ExpenseList(props: { view: "all" | "owe" | "owed", filter: "all" | "paid" | "unpaid", expenses: string[], peopleOweMe: string[], iOwePeople: string[], tripDbDoc: DocumentSnapshot | null, tripMembersInfo: TripMembersInfo, expenses_dict: any, currentUser: string }) {

    if (props.view === "all") {
        let all_paid: string[] = [];
        let all_unpaid: string[] = [];
        // for (const expense in props.expenses_dict) {
        //     let paid: boolean = true;
        //     for (const payee in props.expenses_dict[expense]["payers"]) {
        //         if (props.expenses_dict[expense]["payers"][payee][1] == 0) { //meaning unpaid
        //             paid = false;
        //             break;
        //         }
        //         if (paid) {
        //             all_unpaid.push(expense);
        //         } else {
        //             all_paid.push(expense);
        //         }
        //     }
        // }

        for (const expense of props.expenses) {
            let paid = true;
            for (const payee in props.expenses_dict[expense].payers) {
                const [amount, paidStatus] = props.expenses_dict[expense].payers[payee];

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
            return (
                <div className="flex flex-col gap-3 m-3">
                    {/* {props.expenses.map(expense => (
                        <Expense tripDbDoc={tripDbDoc} tripId={expense}></Expense>
                    ))} */}
                    {
                        props.expenses.map((expenseId: string) => {
                            if (props.tripDbDoc !== null) {
                                return (
                                    <Expense key={expenseId} tripDbDoc={props.tripDbDoc} tripMembersInfo={props.tripMembersInfo} expenseId={expenseId}></Expense>
                                );
                            } else {
                                return null;
                            }
                        })
                    }
                </div>
            );
        } else if (props.filter === "paid") {
            // return (<p>All Expenses View PAID.</p>);
            return (
                <div className="flex flex-col gap-3 m-3">
                    {/* {props.expenses.map(expense => (
                        <Expense tripDbDoc={tripDbDoc} tripId={expense}></Expense>
                    ))} */}
                    {
                        all_paid.map((expenseId: string) => {
                            if (props.tripDbDoc !== null) {
                                return (
                                    <Expense key={expenseId} tripDbDoc={props.tripDbDoc} tripMembersInfo={props.tripMembersInfo} expenseId={expenseId}></Expense>
                                );
                            } else {
                                return null;
                            }
                        })
                    }
                </div>
            );
        } else if (props.filter === "unpaid") {
            // return (<p>All Expenses View UNPAID.</p>);
            return (
                <div className="flex flex-col gap-3 m-3">
                    {/* {props.expenses.map(expense => (
                        <Expense tripDbDoc={tripDbDoc} tripId={expense}></Expense>
                    ))} */}
                    {
                        all_unpaid.map((expenseId: string) => {
                            if (props.tripDbDoc !== null) {
                                return (
                                    <Expense key={expenseId} tripDbDoc={props.tripDbDoc} tripMembersInfo={props.tripMembersInfo} expenseId={expenseId}></Expense>
                                );
                            } else {
                                return null;
                            }
                        })
                    }
                </div>
            );
        }
    } else if (props.view == "owe") {
        let owe_paid: string[] = [];
        let owe_unpaid: string[] = [];

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
            return (
                <div className="flex flex-col gap-3 m-3">
                    {/* {props.expenses.map(expense => (
                        <Expense tripDbDoc={tripDbDoc} tripId={expense}></Expense>
                    ))} */}
                    {
                        props.iOwePeople.map((expenseId: string) => {
                            if (props.tripDbDoc !== null) {
                                return (
                                    <Expense key={expenseId} tripDbDoc={props.tripDbDoc} tripMembersInfo={props.tripMembersInfo} expenseId={expenseId}></Expense>
                                );
                            } else {
                                return null;
                            }
                        })
                    }
                </div>
            );
        } else if (props.filter === "paid") {
            // return (<p>I Owe People View PAID.</p>);
            return (
                <div className="flex flex-col gap-3 m-3">
                    {/* {props.expenses.map(expense => (
                        <Expense tripDbDoc={tripDbDoc} tripId={expense}></Expense>
                    ))} */}
                    {
                        owe_paid.map((expenseId: string) => {
                            if (props.tripDbDoc !== null) {
                                return (
                                    <Expense key={expenseId} tripDbDoc={props.tripDbDoc} tripMembersInfo={props.tripMembersInfo} expenseId={expenseId}></Expense>
                                );
                            } else {
                                return null;
                            }
                        })
                    }
                </div>
            );
        } else if (props.filter === "unpaid") {
            // return (<p>I Owe People View UNPAID.</p>);
            return (
                <div className="flex flex-col gap-3 m-3">
                    {/* {props.expenses.map(expense => (
                        <Expense tripDbDoc={tripDbDoc} tripId={expense}></Expense>
                    ))} */}
                    {
                        owe_unpaid.map((expenseId: string) => {
                            if (props.tripDbDoc !== null) {
                                return (
                                    <Expense key={expenseId} tripDbDoc={props.tripDbDoc} tripMembersInfo={props.tripMembersInfo} expenseId={expenseId}></Expense>
                                );
                            } else {
                                return null;
                            }
                        })
                    }
                </div>
            );
        }
    } else if (props.view == "owed") {

        const owed_paid: string[] = [];
        const owed_unpaid: string[] = [];

        for (const expense of props.peopleOweMe) {
            let paid = true;
            for (const payee in props.expenses_dict[expense].payers) {
                const [amount, paidStatus] = props.expenses_dict[expense].payers[payee];

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
                                        <Expense key={expenseId} tripDbDoc={props.tripDbDoc} tripMembersInfo={props.tripMembersInfo} expenseId={expenseId}></Expense>
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
                                        <Expense key={expenseId} tripDbDoc={props.tripDbDoc} tripMembersInfo={props.tripMembersInfo} expenseId={expenseId}></Expense>
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
                        <p className="font-sunflower text-sidebar_deep_green text-xl text-center p-5">All expenses owed to you are fully paid off!</p>
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
                                        <Expense key={expenseId} tripDbDoc={props.tripDbDoc} tripMembersInfo={props.tripMembersInfo} expenseId={expenseId}></Expense>
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
