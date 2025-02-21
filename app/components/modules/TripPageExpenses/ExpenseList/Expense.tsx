/*
    This component is a card containing the information for a single expense.
    It is to be used in ExpenseList.
*/

import type { DocumentSnapshot } from "firebase/firestore";
import React from "react";

export default function Expense(props: { tripDbDoc: DocumentSnapshot, expenseId: string }) {
    return (
        <div className="bg-toad_count_lime w-full h-[300px] rounded-lg">

        </div>
    );
}
