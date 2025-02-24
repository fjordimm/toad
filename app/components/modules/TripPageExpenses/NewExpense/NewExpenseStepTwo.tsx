import React, { useEffect, useRef, useState } from "react";


export default function NewExpenseStepTwo({totalCost, payees,setPayees, evenSplit, setEvenSplit}:
    {
    evenSplit: boolean,
    setEvenSplit: React.Dispatch<React.SetStateAction<boolean>>
    totalCost: string,
    payees: { [key: string]: number[] },
    setPayees: React.Dispatch<React.SetStateAction<{ [key: string]: number[] }>>}){



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



    return (
        <div className="flex flex-col items-center justify-center w-full gap-4">
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
                    {Object.keys(payees).map((item) =>(
                        <div className="flex justify-between">
                            <NameCard name={item} />
                            <div className="w-48 flex items-center rounded-md gap-2 px-2 font-sunflower text-sidebar_deep_green bg-[#E2F4CE]">
                                $
                                <input 
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    value={payees[item]?.[0] === 0 ? "" : payees[item]?.[0]}
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
    );
}