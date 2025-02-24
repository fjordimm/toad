import React, { useEffect, useRef, useState } from "react";
import cross from "/cross.svg";
import { updateDoc } from 'firebase/firestore';
import { useTripPageLayoutContext, type TripPageLayoutContext } from "app/components/pages/TripPageLayout";
import NewExpenseStepOne from "./NewExpense/NewExpenseStepOne";

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

    // useState for payees and their amounts due to keep track across components
    // Dictionary Structure:
    // name: [amount due, notPaid (0)/Paid (1)
    const [payees, setPayees] = useState<{ [key: string]: number[] }>({});
    console.log(payees)

// ==============================*** BEGIN SOPHIE's CODE *** =======================================================


    const [evenSplit, setEvenSplit] = useState(false); // state for boolean: evenSplit

    // Temporary list
    

    // A dictionary of userExpenses is initialized {key: name string , value: inputtedCost number}
    // This keeps track of the input boxes and ties every input box to its corresponding user
    // const [userExpense, setUserExpense] = useState<{[key:string]: number}>(
    //     Object.fromEntries(payees.map(name => [name,0.00]))
    // );

    // Sum of all inputted costs (takes sum of all values in userExpense dictionary)
    const totalInputAmount = Object.values(payees).reduce((acc,cur) => acc + cur[0], 0);

    // Parameter: a name: string
    // Functionality: Takes in a name and converts it to a JSX component displaying the name and avatar color
    // TODO: pass in avatar color as parameter or convert input to a userDB doc. Currently fixed on orange 
    const NameCard =({name}:{name:string}) => {
        return (
            <div className="flex bg-[#8FA789]/40 px-1 py-1 gap-3 items-center w-48 rounded-md">
                <div
                    className={`w-[18.86px] h-[18.86px] rounded-full bg-orange-600`}
                >
                </div>
    
                <div className="left-[45px] right-0 h-full overflow-hidden whitespace-nowrap text-ellipsis">
                    <span className="text-[#3C533A] font-sunflower text-sm leading-[30px]">
                        {name}
                    </span>
                </div>
            </div>
        );
    };


    // Triggered by change on input cost boxes.
    // Functionality: On every input change, update the inputtedCost in the dictionary of the entry with corresponding name
    // name and value are passed in by a map function - see below
    const handleExpenseInputChange = (name:string, value:number) => {
        setPayees((prevPayees) => ({
            ...prevPayees,
            [name]: [value, ...prevPayees[name].slice(1)]
        }));
    }

    // Parameter: a boolean - what evenSplit state should be set to.
    // Functionality: updates userExpense with new values - even split amount
    const handleSplitMethodButton = (evenSplit: boolean) => {
        setEvenSplit(evenSplit);

        let splitValue =  Math.round((Number(totalCost) / Object.keys(payees).length) * 100) / 100;
        
        setPayees((prevPayees) => {
            const updatedPayees = Object.keys(prevPayees).reduce((acc, key) => {
              acc[key] = [splitValue, ...prevPayees[key].slice(1)]; // Set each user's expense to splitValue
              return acc;
            }, {} as { [key: string]: number[] });  // Type the accumulator to match the state type
        
            return updatedPayees;
        });   
    }


    // Triggered by Scale button in the warning
    // Functionality: updates userExpense with new values - after scaling existing values proportionally
    const handleScaling = () =>{
        if (totalInputAmount == 0 ) return;

        const scalingFactor = Number(totalCost) / totalInputAmount;
        setPayees((prevPayees) => 
            Object.fromEntries(
                Object.entries(prevPayees).map(([key, value]) => [key, [Math.round(value[0] * scalingFactor * 100)/100, ...value.slice(1)]])
            )
        );
    }



    // ==============================*** END SOPHIE's CODE *** =======================================================


    let expenseOwner = tripPageLayoutContext.userDbDoc.get("email");

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
                // payers: makePayeesDictionary(payees, amount)
                payers: payees
            };
            await updateDoc(tripPageLayoutContext.tripDbDoc.ref, {
                [`expenses.${expenseID}`]: newExpense,
            });
        }
        console.log("closed");
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
                                <div className="pt-3">
                                    {/* -------------------------------- */}
                                    {/* Add Toads component here */}
                                    {/* use 'payees' as a parameter and fill out this array with people that owe money*/}
                                    {/* -------------------------------- */}
                                    <NewExpenseStepOne tripDbDoc={tripPageLayoutContext.tripDbDoc} payees={payees} setPayees={setPayees} />
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
                                    {/* Use 'payees' for names and fill 'payees' dictionary Also use evenSplit boolean*/}
                                    {/* -------------------------------- */}

                                    {/* Dynamic vs Even Buttons */}
                                    <div className="flex justify-center font-sunflower text-white">
                                        <button 
                                            className={`w-24 px-4 py-2 rounded-l-xl ${ !evenSplit ? "bg-[#668a45]" : "bg-[#8FAE72]" } `}
                                            onClick={() => handleSplitMethodButton(false)}
                                            type="button"
                                        >
                                            Dynamic
                                        </button>
                                        <button 
                                            className={`w-24 px-4 py-2 rounded-r-xl ${ evenSplit ? "bg-[#668a45]" : "bg-[#8FAE72]" } `}
                                            onClick={() => handleSplitMethodButton(true)}
                                            type="button"
                                        >
                                            Even
                                        </button>
                                    </div>

                                    {/* Specify Expenses Big Box */}
                                    {/* <div> */}
                                    <div className=" w-4/5 h-44 bg-[#BDDE9A] rounded-lg p-4">
                                        <div className="flex flex-col gap-2 overflow-scroll h-full">
                                            {payees.map((item, index) =>(
                                                <div className="flex justify-between">
                                                    <NameCard name={item} />
                                                    <div className="w-48 flex items-center rounded-md gap-2 px-2 font-sunflower text-sidebar_deep_green bg-[#E2F4CE]">
                                                        $
                                                        <input 
                                                            placeholder="0.00"
                                                            min="0"
                                                            step="0.01"
                                                            value={userExpense[item] === 0 ? "" : userExpense[item]}
                                                            className="w-full bg-transparent text-sidebar_deep_green] placeholder:text-sidebar_deep_green/50 font-sunflower focus:outline-none border-b-2 border-sidebar_deep_green/50"
                                                            type="number"
                                                            onChange={(e) => handleExpenseInputChange(item, Number(e.target.value))}
                                                        />
                                                    </div>
                                                </div>
                                            ))}

                                    
                                        </div>        
                                    </div>
                                    {Math.abs(totalInputAmount - Number(totalCost)) >= 0.02 && (
                                        <div className="flex items-center gap-4 text-red-700 text-sm font-sunflower h-10 -mt-4">
                                            <p>Input amounts do not add up to total cost</p>
                                            <div className="flex gap-4">
                                                <button 
                                                    className=" text-center w-18 px-4 bg-[#8FAE72] text-[#FFF] rounded-md"
                                                    type="button"
                                                    onClick={(e) => handleScaling()}
                                                >
                                                    Scale
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    
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