/*
    This component is a card containing the information for a single expense.
    It is to be used in ExpenseList.
*/

import React, { useEffect, useState } from "react";
import type { DocumentSnapshot } from "firebase/firestore";
import { dbRetrieveUser } from "~/src/databaseUtil";
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

    return (
        <div className="bg-toad_count_lime w-full rounded-lg flex flex-col p-3 gap-3">
            {
                expenseOwnerDbDoc !== null
                    ? (
                        <div className="flex flex-row gap-3 items-center">
                            <div className="bg-slate-700 rounded-full w-10 h-10"></div>
                            <span className="font-sunflower text-lg">
                                <span className="font-bold">{expenseOwnerDbDoc.get("first_name")}</span>
                                <span> is requesting a payment split on </span>
                                <span className="font-bold">{expenseObj.name}</span>
                            </span>
                        </div>
                    )
                    : <Loading />
            }
        </div>
    );
}
