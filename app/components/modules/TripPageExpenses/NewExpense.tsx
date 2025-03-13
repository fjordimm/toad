/*
 Description:
  A modal for adding a new expense.
 
 Interactions:
  - Parent Component(s): TripPageExpenses
  - Direct Children Component(s): NewExpenseStepOne, NewExpenseStepTwo
  - Database: Firestore writes
*/

import React, { useRef, useState } from "react";
import cross from "/cross.svg";
import { useTripPageLayoutContext, type TripPageLayoutContext } from "app/components/pages/TripPageLayout";
import NewExpenseStepOne from "./NewExpense/NewExpenseStepOne";
import NewExpenseStepTwo from "./NewExpense/NewExpenseStepTwo";
import { dbAddExpense } from "~/src/databaseUtil";
import { debugLogComponentRerender } from "~/src/debugUtil";

export default function NewExpense(props: { onClose: () => void }) {

    debugLogComponentRerender("NewExpense");

    const modalContentRef = useRef<HTMLDivElement>(null);
    const tripPageLayoutContext: TripPageLayoutContext = useTripPageLayoutContext();

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
            props.onClose();
        }
    };

    const [activeSection, setActiveSection] = useState(1);

    const [expenseName, setExpenseName] = useState('');
    const [date, setDate] = useState('');
    const [totalCost, setTotalCost] = useState('');

    // useState for payees and their amounts due to keep track across components
    // Dictionary Structure:
    // name: [amount due, notPaid (0)/Paid (1)
    const [payees, setPayees] = useState<{ [key: string]: number[] }>({});
    const [evenSplit, setEvenSplit] = useState(false); // state for boolean: evenSplit


    const expenseOwner = tripPageLayoutContext.userDbDoc.get("email");

    // called when user clicks submit. Makes the map and sends it to database.
    async function handleSubmitExpense(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (tripPageLayoutContext.tripDbDoc !== null) {

            if (expenseOwner in payees) {
                payees[expenseOwner][1] = 1;
            }

            await dbAddExpense(tripPageLayoutContext.tripDbDoc.ref, expenseName, totalCost, date, expenseOwner, evenSplit, payees);
        }

        props.onClose();
    }

    return (
        <div
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
            onClick={handleOverlayClick}
        >
            {/* Modal content container */}
            <div
                ref={modalContentRef}
                className="relative flex flex-col w-2/5 justify-center items-center bg-dashboard_component_bg py-8 rounded-2xl gap-6"
                // Stop click events from bubbling to the overlay
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-center px-4 h-12">
                    <p className="font-sunflower text-sidebar_deep_green text-2xl">
                        Add an Expense
                    </p>
                </div>
                <div
                    className="absolute top-4 right-4 rounded-full h-10 w-10 flex items-center justify-center bg-sidebar_button_bg cursor-pointer"
                    onClick={props.onClose}
                >
                    <img src={cross} className="w-7 h-7" />
                </div>
                {/* Form Container */}
                <form onSubmit={handleSubmitExpense} className="w-full flex flex-col justify-center items-center">
                    {/* Expense Name Input */}
                    <div className="bg-sidebar_deep_green/15 py-4 px-8 w-11/12 rounded-2xl focus-within:ring-[#FFF]/40 focus-within:ring-2">
                        <input
                            type="text"
                            id="expenseName"
                            name="expenseName"
                            onChange={(e) => setExpenseName(e.target.value)}
                            required
                            placeholder="Expense Name"
                            className="w-full bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower focus:outline-none border-b-2 border-[#FFF]/50"
                        />
                    </div>
                    {/* Container Div for the 2 row inputs */}
                    <div className="w-full grid grid-cols-2 gap-y-4 gap-x-4 py-4 px-8">
                        <div className="bg-sidebar_deep_green/15 left-0 py-4 px-8 rounded-2xl focus-within:ring-[#FFF]/40 focus-within:ring-2">
                            <input
                                type="date"
                                id="date"
                                name="date"
                                onChange={(e) => setDate(e.target.value)}
                                maxLength={14}
                                placeholder="Date"
                                className="w-full bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower focus:outline-none border-b-2 border-[#FFF]/50"
                            />
                        </div>
                        <div className="bg-sidebar_deep_green/15 py-4 px-8 rounded-2xl focus-within:ring-[#FFF]/40 focus-within:ring-2">
                            <input
                                type="number"
                                step="0.01"
                                min="0.00"
                                id="totalCost"
                                name="totalCost"
                                onChange={(e) => setTotalCost(e.target.value)}
                                maxLength={14}
                                placeholder="Total Cost"
                                className="w-full bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower focus:outline-none border-b-2 border-[#FFF]/50"
                            />
                        </div>
                    </div>
                    {/* Container Div for the adding toads to expense and amount split components*/}
                    <div className="w-full">
                        {/* Page 1 of Modal*/}
                        {activeSection === 1 && (
                            <div className="relative w-full p-4 h-96 justify-items-center">
                                {/* Step Number & Title */}
                                <div className="flex items-center space-x-4">
                                    <div className="rounded-full bg-[#8FAE72] h-10 w-10 flex items-center justify-center">
                                        <h1 className="text-white text-xl font-semibold">1.</h1>
                                    </div>
                                    <h1 className="text-white text-xl font-light">Add Toads To Expense</h1>
                                </div>
                                <div className="pt-3">
                                    {/* -------------------------------- */}
                                    {/* Add Toads component here */}
                                    {/* use 'payees' as a parameter and fill out this array with people that owe money*/}
                                    {/* -------------------------------- */}
                                    <NewExpenseStepOne tripMembersInfo={tripPageLayoutContext.tripMembersInfo} payees={payees} setPayees={setPayees} />
                                </div>
                                {/* Next Button */}
                                <div className="absolute bottom-4 right-4">
                                    <button
                                        onClick={() => setActiveSection(2)}
                                        className="bg-[#8FAE72] text-white py-3 px-6 rounded-lg text-lg"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>

                        )}
                        {/* Page 2 of Modal */}
                        {activeSection === 2 && (
                            <div className="relative w-full p-4 h-96 justify-items-center">
                                {/* Step Number & Title */}
                                <div className="flex justify-center items-center space-x-4 ">
                                    <div className="rounded-full bg-[#8FAE72] h-10 w-10 flex items-center justify-center">
                                        <h1 className="text-white text-xl font-sunflower">2.</h1>
                                    </div>
                                    <h1 className="text-white text-xl font-sunflower">Specify Payment Amount</h1>
                                </div>

                                <div className="flex flex-col items-center justify-center mt-4 w-full gap-4">
                                    {/* --------------------------------
                                    {/* Payment Breakdown Component Here */}
                                    {/* Use 'payees' for names and fill 'payees' dictionary Also use evenSplit boolean*/}
                                    {/* -------------------------------- */}

                                    <NewExpenseStepTwo
                                        tripMembersInfo={tripPageLayoutContext.tripMembersInfo}
                                        evenSplit={evenSplit}
                                        setEvenSplit={setEvenSplit}
                                        totalCost={totalCost}
                                        payees={payees}
                                        setPayees={setPayees}
                                    />


                                </div>
                                {/* Back Button */}
                                <div className="absolute bottom-0 left-4">
                                    <button
                                        onClick={() => setActiveSection(1)}
                                        className="font-sunflower bg-[#8FAE72] text-white py-2 px-4 rounded-lg text-lg"
                                    >
                                        Back
                                    </button>
                                </div>
                                {/* Submit Button */}
                                <div className="absolute bottom-0 right-4">
                                    <button
                                        type="submit"
                                        onClick={() => setActiveSection(2)}
                                        className="font-sunflower bg-[#8FAE72] text-white py-2 px-4 rounded-lg text-lg"
                                    >
                                        Create Expense
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}