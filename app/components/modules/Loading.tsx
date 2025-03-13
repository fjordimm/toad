/*
 Description:
  A simple component to be used for when you are waiting on an asynchronous function but need to display something in the meantime.
 
 Interactions:
  - Parent Component(s): (not listed here)
  - Direct Children Component(s): none
  - Database: none
*/

import React from "react";
import { debugLogComponentRerender } from "~/src/debugUtil";

export default function Loading() {

    debugLogComponentRerender("Loading");
    
    return (
        <div className="flex justify-center items-center p-3 bg-dashboard_component_bg">
            <p className="font-sunflower text-white">Loading...</p>
        </div>
    );
}
