import React, {useState} from "react"

interface AddDestinationProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }

const AddDestination: React.FC<AddDestinationProps> = ({setIsOpen}) => {
    return(
    <div onClick={() => setIsOpen(false)}>
        <div className= "flex flex-col justify-center items-center bg-dashboard_component_bg py-8 w-3/5 rounded-2xl min-w-36 gap-4">
        
        </div>
    </div>
    );
}

export default AddDestination;