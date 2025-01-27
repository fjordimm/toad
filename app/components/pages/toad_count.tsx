import React, { useState } from "react";
import ToadMembers from "./members";

const ToadCountComponent: React.FC = () => {
  const [email, setEmail] = useState("");

  return (
    <div className="relative">
      {/* Positioning the container closer to the top-left */}
      <div
        className="absolute top-2 right-2 max-w-[271px] w-full max-h-[330px] bg-[#EAFFB9] p-6 rounded-lg shadow-lg"
      >
        {/* Toad Count */}
        <div className="flex flex-col items-center text-[24px] font-sunflower text-[#3C533A]">
          Toad Count: #
        </div>

        {/* Member List */}
        <div className="mt-4 max-h-40 overflow-y-auto scrollbar-none space-y-3">
          <ToadMembers name="Angelina" />
          <ToadMembers name="Billiam" />
          <ToadMembers name="Sophie" />
          <ToadMembers name="Arnav" />
          <ToadMembers name="Jiggy" />
        </div>

        {/* Email Input and Invite Button */}
        <div className="mt-2 flex flex-col items-center space-y-3">
          <input
            type="email"
            placeholder="Enter member email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full max-w-[207px] h-[22px] bg-white border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-lime-400 text-center"
          />
          <button
            className="w-full max-w-[207px] h-[29px] bg-[#BCD3B5]/50 text-[#3C533A] rounded-lg text-sm hover:bg-[#BCD3B5]/70 text-center"
          >
            + Invite Member
          </button>
        </div>
        {/* Delete Trip Button */}
        <div className="mt-7 flex flex-col items-center">
            <button
              onClick={() => console.log("Trip deleted")}
              className="w-[271px] h-[46px] bg-[#D86D6D]/50 text-white rounded-lg text-sm hover:bg-[#D86D6D]/70 text-center"
            >
              Delete Trip
            </button>
          </div>
      </div>
    </div>
  );
};

export default ToadCountComponent;
