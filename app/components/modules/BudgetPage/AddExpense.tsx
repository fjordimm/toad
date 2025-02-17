import React, { useRef, useState } from 'react';
import { updateDoc, type DocumentSnapshot } from 'firebase/firestore';

type AddExpenseProps = {
  //tripDbDoc: DocumentSnapshot| null;
  onClose: () => void;
};


const AddExpense: React.FC<AddExpenseProps> = ({ onClose }) => {

    const modalContentRef = useRef<HTMLDivElement>(null);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
          onClose();
        }
      };

    return(
        <div 
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
            onClick={handleOverlayClick}>
            <div 
                ref={modalContentRef}
                className="flex flex-col w-2/5 justify-center items-center bg-dashboard_component_bg py-8 rounded-2xl gap-6"
                // Stop click events from bubbling to the overlay
                onClick={(e) => e.stopPropagation()}>
                <div>

                </div>
            </div>
        </div>
    );

}

export default AddExpense