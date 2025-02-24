/*
    This component is a card containing the information for a single expense.
    It is to be used in ExpenseList.
*/

import React, { useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import type { DocumentSnapshot } from "firebase/firestore";
import { dbDeleteExpense, dbMarkExpenseAsPaidOrUnpaid, dbRetrieveUser } from "~/src/databaseUtil";
import Loading from "../../Loading";

export default function Expense(props: { tripDbDoc: DocumentSnapshot, expenseId: string }) {

    const expenseObj: any = props.tripDbDoc.get("expenses")[props.expenseId];

    const [expenseOwnerDbDoc, setExpenseOwnerDbDoc] = useState<DocumentSnapshot | null>(null);
    useEffect(
        () => {
            dbRetrieveUser(expenseObj.expense_owner).then(
                (result: DocumentSnapshot) => {
                    setExpenseOwnerDbDoc(result);
                }
            );
        },
        [props.tripDbDoc]
    );

    const payers: { [key: string]: any } = expenseObj.payers;
    const payersKeys: string[] = Object.keys(payers);
    payersKeys.sort((a, b) => { return a.localeCompare(b); }); // Sorted by string because the database is inconsistent
    
    const payersDbDocs: [DocumentSnapshot | null, Dispatch<SetStateAction<DocumentSnapshot | null>>][] = [];
    // Setting the values for payersDbDocs:
    for (let i = 0; i < payersKeys.length; i++) {
        payersDbDocs.push(useState<DocumentSnapshot | null>(null));
    }
    for (let i = 0; i < payersKeys.length; i++) {
        useEffect(
            () => {
                dbRetrieveUser(payersKeys[i]).then(
                    (result: DocumentSnapshot) => {
                        payersDbDocs[i][1](result); // The [1] is the setter function from useState
                    }
                );
            },
            []
        );
    }

    async function handleMarkAsPaid(payerId: string) {
        await dbMarkExpenseAsPaidOrUnpaid(props.tripDbDoc.ref, props.expenseId, payerId, true);
    }

    async function handleMarkAsUnpaid(payerId: string) {
        await dbMarkExpenseAsPaidOrUnpaid(props.tripDbDoc.ref, props.expenseId, payerId, false);
    }

    function turnPayersDbDocsIntoElems(): ReactNode {

        const payersAsElems = [];
        for (let i = 0; i < payersKeys.length; i++) {
            const payerDbDoc: DocumentSnapshot | null = payersDbDocs[i][0];
            const payerObj: any = payers[payersKeys[i]];

            if (payerDbDoc !== null) {
                payersAsElems.push(
                    <div key={i} className="flex flex-row gap-7 items-center">
                        <div className="w-[148px] h-[28px] bg-[#8FA789]/40 rounded-lg shadow-sm flex flex-row items-center py-1 px-2 gap-2">
                            <div className="bg-trip_member_col_5 min-w-5 min-h-5 w-5 h-5 rounded-full"></div>
                            <div className="overflow-hidden whitespace-nowrap text-ellipsis">
                                <span className="text-[#3C533A] font-sunflower text-sm leading-[30px]">{`${payerDbDoc.get("first_name")} ${payerDbDoc.get("last_name")}`}</span>
                            </div>
                        </div>

                        <span className="font-sunflower font-bold">{`$${payerObj[0].toFixed(2)}`}</span>

                        {
                            payerObj[1] === 0
                                ? <button onClick={() => { handleMarkAsPaid(payersKeys[i]) }} className="w-20 h-5 rounded-lg bg-unpaid_button/70 hover:bg-unpaid_button/100 flex justify-center items-center">
                                    <span className="font-sunflower text-xs">Mark as paid</span>
                                </button>
                                : <button onClick={() => { handleMarkAsUnpaid(payersKeys[i]) }} className="w-20 h-5 rounded-lg bg-paid_button/70 hover:bg-paid_button/100 flex justify-center items-center">
                                    <span className="font-sunflower text-xs">Paid</span>
                                </button>
                        }
                    </div>
                );
            } else {
                payersAsElems.push(
                    <Loading key={i} />
                );
            }
        }

        return (
            <div className="flex flex-col gap-2">
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

    return (
        <div className="bg-toad_count_lime w-full rounded-lg flex flex-col p-3 gap-3">
            {
                expenseOwnerDbDoc !== null
                    ? (
                        <div className="flex flex-row gap-3 items-center">
                            <div className="bg-slate-700 rounded-full min-w-10 min-h-10 w-10 h-10"></div>
                            <span className="font-sunflower text-lg">
                                <span className="font-bold">{expenseOwnerDbDoc.get("first_name")}</span>
                                <span> is requesting a payment split on </span>
                                <span className="font-bold">{expenseObj.name}</span>
                            </span>
                        </div>
                    )
                    : <Loading />
            }
            <div className="flex flex-row justify-between items-end pl-12">
                {turnPayersDbDocsIntoElems()}

                <button onClick={handleDeleteButton} className="bg-[#D86D6D]/70 hover:bg-[#D86D6D]/80 flex justify-center items-center px-5 py-1 rounded-lg">
                    <span className="font-sunflower text-base text-white">Delete Expense</span>
                </button>
            </div>
        </div>
    );
}
