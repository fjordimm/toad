import React, { useEffect, useRef, useState } from "react";
import cross from "/cross.svg";
import { updateDoc } from 'firebase/firestore';
import { useTripPageLayoutContext, type TripPageLayoutContext } from "app/components/pages/TripPageLayout";

export default function NewExpense(props: { onClose: () => void }) {

    const modalContentRef = useRef<HTMLDivElement>(null);
    const tripPageLayoutContext: TripPageLayoutContext = useTripPageLayoutContext();

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
            props.onClose();
        }
    };

    // Generate unique id for each expense
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    const [activeSection, setActiveSection] = useState(1);

    const [expenseName, setExpenseName] = useState('');
    const [date, setDate] = useState('');
    const [totalCost, setTotalCost] = useState('');
    console.log(date);

    let payees: string[] = [] // array to pass in for list of people in expense
    let amount: number[] = [] // array to pass in for the amount people owe
    let evenSplit: boolean = false; //change if sophie says so 
    let expenseOwner = tripPageLayoutContext.userDbDoc.get("email");


    // turn payees and ammount arrays into map
    function makePayeesDictionary(payees: string[], amount: number[]): { [key: string]: [number, number] } {
        const dictionary = payees.reduce((acc, name, index) => {
            acc[name] = [amount[index], 0];
            return acc;
        }, {} as { [key: string]: [number, number] });

        return dictionary;
    }

    // called when user clicks submit. Makes the map and sends it to database.
    async function handleSubmitDestination(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (tripPageLayoutContext.tripDbDoc !== null) {
            const expenseID = uuidv4();
            const newExpense = {
                name: expenseName,
                total_amount: totalCost,
                even_split: evenSplit,
                date: date,
                expense_owner: expenseOwner,
                payers: makePayeesDictionary(payees, amount)
            };
            await updateDoc(tripPageLayoutContext.tripDbDoc.ref, {
                [`expenses.${expenseID}`]: newExpense,
            });
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
                <form onSubmit={handleSubmitDestination} className="w-full flex flex-col justify-center items-center">
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
                                <div>
                                    {/* -------------------------------- */}
                                    {/* Add Toads component here */}
                                    {/* use 'payees' as a parameter and fill out this array with people that owe money*/}
                                    {/* -------------------------------- */}
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
                                    {/* -------------------------------- */}
                                    {/* Payment Breakdown Component Here */}
                                    {/* Use 'payees' for names and fill array 'amount'. Also use evenSplit boolean*/}
                                    {/* Don't change the order of the names or amounts becuase the order matters */}
                                    {/* -------------------------------- */}

                                    {/* Dynamic vs Even Buttons */}
                                    <div className="flex justify-center font-sunflower text-white">
                                        <button className="w-24 px-4 py-2 bg-[#8FAE72] rounded-l-xl">
                                            Dynamic
                                        </button>
                                        <button className="w-24 px-4 py-2 bg-[#668a45] rounded-r-xl">
                                            Even
                                        </button>
                                    </div>

                                    {/* Specify Expenses Big Box */}
                                    {/* <div> */}
                                    <div className=" w-4/5 h-48 bg-[#BDDE9A] rounded-lg">
                                        
                                    </div>
                                    
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