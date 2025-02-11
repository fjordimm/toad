import React, {useRef} from "react"
import { type DocumentReference } from "firebase/firestore";

type AddDestinationProps = {
    tripDbDoc: DocumentReference | null;
    onClose: () => void;
  };

const AddDestination: React.FC<AddDestinationProps> = ({ tripDbDoc, onClose }) => {

    const modalContentRef = useRef<HTMLDivElement>(null);

    const dialogRef = useRef(null);

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, 
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    const destKey = uuidv4();
    let dest = {}

    // if(props.tripDbDoc) {
    //     props.tripDbDoc.set({destinations: {[destKey]: dest}}, { merge: true });
    // }
    

    return(
    // parent div; will eventually need to make the background transparent and cover the whole page
    // <div className = "flex justify-center items-center w-full h-full p-0 bg-neutral-800/5 gap-0 mx-0 my-0">
        <dialog ref={dialogRef} className= "flex flex-col w-3/5 justify-center items-center bg-dashboard_component_bg py-8 rounded-2xl gap-6">
            <p className = "font-sunflower text-sidebar_deep_green text-2xl">Add A Potential Destination</p>
            {/* Form Container */}
            <form className = "w-full flex flex-col justify-center items-center">
                {/* Container Div for the Destination Name form input */}
                <div className="bg-sidebar_deep_green/15 py-4 px-8 w-11/12 rounded-2xl focus-within:ring-[#FFF]/40 focus-within:ring-2">
                    <input
                        type = "text"
                        id = "destinationName"
                        name = "destinationName"
                        required
                        placeholder = "Destination Name"
                        className = "w-full min-w-32 bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower focus:outline-none focus:ring-0  border-b-2 border-[#FFF]/50"
                        >
                    </input>
                </div>
                {/*Container Div for the 3 row inputs */}
                <div className = "flex flex-row gap-4 w-11/12 py-4 px-4 justify-center">
                    <div className="bg-sidebar_deep_green/15 w-1/3 py-4 px-8 rounded-2xl focus-within:ring-[#FFF]/40 focus-within:ring-2">
                        <input
                            type = "text"
                            id = "price"
                            name = "price"
                            maxLength={14}
                            required
                            placeholder = "Price"
                            className = "w-full min-w-32 bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower focus:outline-none focus:ring-0  border-b-2 border-[#FFF]/50"
                            >
                        </input>
                    </div>
                    <div className="bg-sidebar_deep_green/15 py-4 px-8 w-1/3 rounded-2xl focus-within:ring-[#FFF]/40 focus-within:ring-2">
                        <input
                            type = "text"
                            id = "length"
                            name = "length"
                            maxLength={14}
                            required
                            placeholder = "Length"
                            className = "w-full min-w-32 bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower focus:outline-none focus:ring-0  border-b-2 border-[#FFF]/50"
                            >
                        </input>
                    </div>
                    <div className="bg-sidebar_deep_green/15 py-4 px-8 w-1/3 rounded-2xl focus-within:ring-[#FFF]/40 focus-within:ring-2">
                        <input
                            type = "text"
                            id = "timeOfDay"
                            name = "timeOfDay"
                            maxLength={14}
                            required
                            placeholder = "Time of Day"
                            className = "w-full min-w-32 bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower focus:outline-none focus:ring-0  border-b-2 border-[#FFF]/50"
                            >
                        </input>
                    </div>
                </div>
                {/* Container Div for the Description */}
                <div className="bg-sidebar_deep_green/15 py-4 px-8 w-11/12 min-h-28 rounded-2xl focus-within:ring-[#FFF]/40 focus-within:ring-2">
                    <textarea
                        id = "destinationName"
                        name = "destinationName"
                        required
                        placeholder = "Description"
                        className = "w-full min-w-32 min-h-36 bg-transparent text-[#FFF] placeholder:text-[#FFF]/50 font-sunflower focus:outline-none focus:ring-0"
                        >
                    </textarea>
                </div>
            </form>
            {/* <form method = "dialog">
                <button className = 'w-11/12 bg-sidebar_deep_green/50 font-sunflower text-[#FFF]/80 py-4 rounded-2xl'>Close</button>
            </form> */}
        </dialog>
    // </div>
    );
}

export default AddDestination;