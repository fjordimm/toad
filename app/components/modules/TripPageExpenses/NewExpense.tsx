import React, { useRef, useState } from "react";
import cross from "/cross.svg";

export default function NewExpense(props: { onClose: () => void }) {

    const modalContentRef = useRef<HTMLDivElement>(null);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
            props.onClose();
        }
    };

    const [activeSection, setActiveSection] = useState(1);

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

                {/* Close (X) Button - Positioned to the Top Right of Modal */}
                <div
                    className="absolute top-4 right-4 rounded-full h-10 w-10 flex items-center justify-center bg-sidebar_button_bg cursor-pointer"
                    onClick={props.onClose}
                >
                    <img src={cross} className="w-7 h-7" />
                </div>


                {/* Form Container */}
                <form className="w-full flex flex-col justify-center items-center">
                    {/* Expense Name Input */}
                    <div className="bg-sidebar_deep_green/15 py-4 px-8 w-11/12 rounded-2xl focus-within:ring-[#FFF]/40 focus-within:ring-2">
                        <input
                            type="text"
                            id="expenseName"
                            name="expenseName"
                            required
                            placeholder="Expense Name"
                            className="w-full bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower focus:outline-none border-b-2 border-[#FFF]/50"
                        />
                    </div>
                    {/* Container Div for the three row inputs */}
                    <div className="w-full grid grid-cols-2 gap-y-4 gap-x-4 py-4 px-8">
                        <div className="bg-sidebar_deep_green/15 left-0 py-4 px-8 rounded-2xl focus-within:ring-[#FFF]/40 focus-within:ring-2">
                            <input
                                type="text"
                                id="date"
                                name="date"
                                maxLength={14}
                                placeholder="Date"
                                className="w-full bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower focus:outline-none border-b-2 border-[#FFF]/50"
                            />
                        </div>
                        <div className="bg-sidebar_deep_green/15 py-4 px-8 rounded-2xl focus-within:ring-[#FFF]/40 focus-within:ring-2">
                            {/* Change type to float later */}
                            <input
                                type="text"
                                id="totalCost"
                                name="totalCost"
                                maxLength={14}
                                placeholder="Total Cost"
                                className="w-full bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower focus:outline-none border-b-2 border-[#FFF]/50"
                            />
                        </div>
                    </div>
                    {/* Container Div for the adding toads to expense and amount split components*/}
                    <div className="w-full">
                        {/* Page 1 */}
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
                                    {/* Add Toads component here */}
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
                        {activeSection === 2 && (
                            <div className="relative w-full p-4 h-96 justify-items-center">
                                {/* Step Number & Title */}
                                <div className="flex items-center space-x-4">
                                    <div className="rounded-full bg-[#8FAE72] h-10 w-10 flex items-center justify-center">
                                        <h1 className="text-white text-xl font-semibold">2.</h1>
                                    </div>
                                    <h1 className="text-white text-xl font-light">Specify Payment Amount</h1>
                                </div>
                                <div>
                                    {/* Payment breakdown component here */}
                                </div>
                                {/* Back Button */}
                                <div className="absolute bottom-4 left-4">
                                    <button
                                        onClick={() => setActiveSection(1)}
                                        className="bg-[#8FAE72] text-white py-3 px-6 rounded-lg text-lg"
                                    >
                                        Back
                                    </button>
                                </div>
                                {/* Submit Button */}
                                <div className="absolute bottom-4 right-4">
                                    <button
                                        onClick={() => setActiveSection(2)}
                                        className="bg-[#8FAE72] text-white py-3 px-6 rounded-lg text-lg"
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