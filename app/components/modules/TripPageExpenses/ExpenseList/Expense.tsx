/*
 Description:
  A card containing the information for a single expense.
 
 Interactions:
  - Parent Component(s): ExpenseList, MemberBreakdown
  - Direct Children Component(s): none
  - Database: Firestore writes
*/

import React, { type ReactNode } from "react";
import type { DocumentSnapshot } from "firebase/firestore";
import { dbDeleteExpense, dbMarkExpenseAsPaidOrUnpaid } from "~/src/databaseUtil";
import type { TripMembersInfo } from "~/components/pages/TripPageLayout";
import { debugLogComponentRerender } from "~/src/debugUtil";

const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function Expense(props: { tripDbDoc: DocumentSnapshot, tripMembersInfo: TripMembersInfo, expenseId: string, currUser: string}) {

    debugLogComponentRerender("Expense");
    
    const expenseObj: any = props.tripDbDoc.get("expenses")[props.expenseId];

    const expenseOwnerInfo = props.tripMembersInfo[expenseObj.expense_owner];

    const payers: { [key: string]: any } = expenseObj.payers;
    const payersKeys: string[] = Object.keys(payers);
    payersKeys.sort((a, b) => { return a.localeCompare(b); }); // Sorted by string because the dictionary order is inconsistent

    async function handleMarkAsPaid(payerId: string) {
        await dbMarkExpenseAsPaidOrUnpaid(props.tripDbDoc.ref, props.expenseId, payerId, true);
    }

    async function handleMarkAsUnpaid(payerId: string) {
        await dbMarkExpenseAsPaidOrUnpaid(props.tripDbDoc.ref, props.expenseId, payerId, false);
    }

    function turnPayersDbDocsIntoElems(): ReactNode {

        const payersAsElems = [];
        for (const payerId of payersKeys) {
            const payerObj = payers[payerId];
            const payerInfo = props.tripMembersInfo[payerId];

            payersAsElems.push(
                <React.Fragment key={payerId}>
                    <div className="w-[148px] h-[28px] bg-[#8FA789]/40 rounded-lg shadow-sm flex flex-row items-center py-1 px-2 gap-2">
                        <div className={`min-w-5 min-h-5 w-5 h-5 rounded-full ${payerInfo.color}`}></div>
                        <div className="overflow-hidden whitespace-nowrap text-ellipsis">
                            <span className="text-[#3C533A] font-sunflower text-sm leading-[30px]">{`${payerInfo.dbDoc.get("first_name")} ${payerInfo.dbDoc.get("last_name")}`}</span>
                        </div>
                    </div>

                    <span className="font-sunflower font-bold">{`$${payerObj[0].toFixed(2)}`}</span>

                    {
                        payerObj[1] === 0
                            ? <button onClick={() => { handleMarkAsPaid(payerId) }} className="w-20 h-5 rounded-lg bg-unpaid_button/70 hover:bg-unpaid_button/100 flex justify-center items-center">
                                <span className="font-sunflower text-xs">Mark as paid</span>
                            </button>
                            : <button onClick={() => { handleMarkAsUnpaid(payerId) }} className="w-20 h-5 rounded-lg bg-paid_button/70 hover:bg-paid_button/100 flex justify-center items-center">
                                <span className="font-sunflower text-xs">Paid</span>
                            </button>
                    }
                </React.Fragment>
            );
        }

        return (
            <div className="grid grid-cols-[auto_auto_auto] gap-x-7 gap-y-1">
                {
                    payersAsElems.map((elem: ReactNode) => {
                        return elem;
                    })
                }
            </div>
        );
    }

    async function handleDeleteButton() {
        await dbDeleteExpense(props.tripDbDoc.ref, props.expenseId);
    }

    const expenseDate = new Date(expenseObj.date);
    const expenseDateString = `${months[expenseDate.getUTCMonth()]} ${expenseDate.getUTCDate()}, ${expenseDate.getUTCFullYear()}`;

    return (
        <div className="bg-toad_count_lime rounded-lg flex flex-col p-3 gap-3">
            {
                <div className="flex flex-row gap-3 items-center">
                    <div className={`rounded-full min-w-10 min-h-10 w-10 h-10 ${expenseOwnerInfo.color}`}></div>
                    <span className="font-sunflower text-lg">
                        <span className="font-bold">{expenseOwnerInfo.dbDoc.get("first_name")}</span>
                        <span> is requesting a payment split on </span>
                        <span className="font-bold">{expenseObj.name}</span>
                        <span className="text-black/50">{` (${expenseDateString})`}</span>
                    </span>
                </div>
            }
            <div className="flex flex-row justify-between items-end pl-12">
                {turnPayersDbDocsIntoElems()}

                {expenseOwnerInfo.dbDoc.get("email") === props.currUser ? <button onClick={handleDeleteButton} className="bg-[#D86D6D]/70 hover:bg-[#D86D6D]/80 flex justify-center items-center px-5 py-1 rounded-lg">
                    <span className="font-sunflower text-base text-white">Delete Expense</span>
                </button>: null}
            </div>
        </div>
    );
}
