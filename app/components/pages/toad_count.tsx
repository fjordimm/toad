import React, { useState } from "react";
import ToadMember from "./members"; // Import the ToadMembers component

const ToadCountComponent: React.FC = () => {
  const [email, setEmail] = useState("");

  return (
    <div
      className="absolute left-[1215px] top-[22px] w-[271px] h-[330px] bg-[#EAFFB9] p-6 rounded-lg shadow-lg"
    >
      {/* Toad Count */}
      <div className="flex flex-col items-center text-[24px] font-sunflower text-[#3C533A] -mt-2">
        Toad Count: #
      </div>

      {/* Member List */}
      <div className="mt-3 max-h-40 overflow-y-auto scrollbar-none">
        <div className="space-y-3">
          {/* Can add members to the trip by calling <ToadMembers name="name" /> */}
          <ToadMember name="Angelina" />
          <ToadMember name="Billiam" />
          <ToadMember name="Sophie" />
          <ToadMember name="Arnav" />
          <ToadMember name="Jiggy" />
          <ToadMember name="Angelina" />
        </div>
      </div>
      

      {/* Email Input and Invite Button */}
      {/* I believe I set the email here. use this to update invited users */}
      <div className="flex flex-col items-center">
        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter member email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="absolute top-[235px] w-[207px] h-[22px] bg-white border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-lime-400 text-center"
        />
        {/* Invite Button */}
        <button
          className="absolute top-[265px] w-[207px] h-[29px] bg-[#BCD3B5]/50 text-[#3C533A] rounded-lg text-sm hover:bg-[#BCD3B5]/70 text-center"
        >
          + Invite Member
        </button>
      </div>

      {/* Delete Trip Button */}
      {/* Will need to update this to delete the member and delete button on the screen and delete the member from firebase! */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => console.log("Trip deleted")}
          className="absolute top-[335px] w-[271px] h-[46px] bg-[#D86D6D]/50 text-[#FFFFFF] rounded-lg text-sm hover:bg-[#D86D6D]/70 text-center"
        >
          Delete Trip
        </button>
      </div>
    </div>
  );
};

export default ToadCountComponent;
