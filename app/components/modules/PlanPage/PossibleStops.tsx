import { useEffect, useState, type ReactNode } from 'react';

function PossibleStops() {

    return(
        // remove border from outer div when implemented
        <div className="absolute right-4 top-8 bottom-8 border border-black w-1/6"> 
            <h1 className='text-center font-[sunflower] mt-8 text-2xl text-sidebar_deep_green'>Possible Stops</h1>
            <div className="flex justify-center">
                <hr className="h-px my-4 border-sidebar_deep_green w-4/5 border-[1px]" />
            </div>
    
        </div>

    )

}

export default PossibleStops

