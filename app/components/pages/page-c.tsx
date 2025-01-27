import React, { useState } from "react";

const ToadCountComponent: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleButtonClick = () => {
	console.log("Button clicked");
    console.log(1); // Output '1' to the terminal when buttons are clicked
  };

  return (
    <div
      className="absolute left-[1215px] top-[22px] w-[271px] h-[328px] bg-[#EAFFB9] p-6 rounded-lg shadow-lg flex flex-col justify-between"
    >
      {/* Toad Count */}
      <div className="text-[24px] font-sunflower text-[#3C533A] text-center -mt-2">
        Toad Count: 8
      </div>

      {/* Toad List */}
      <div className="space-y-3 mt-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            {/* Name Box */}
            <div className="relative w-[148px] h-[28px] bg-[#8FA789]/40 rounded-lg shadow-sm -ml-2">
  				{/* Circle representing the color icon, absolutely positioned at the left */}
 				 <div
    				className="w-[18.86px] h-[18.86px] bg-white rounded-full absolute left-[8px] top-1/2 transform -translate-y-1/2"
  				></div>
  				<span className="text-[#3C533A] font-sunflower text-sm ml-[50px] leading-[30px]"> {/* Added padding-left to ensure text is spaced properly */}
    				{/*Toad {index + 1}*/}
					Angelina Cruz
  				</span>
			</div>
            {/* Delete Button */}
            <button
              onClick={handleButtonClick}
              className="relative w-[28px] h-[26px] bg-[#EACBAC] rounded-lg flex items-center justify-center hover:bg-[#EACBAC]/80 -ml-2"
            >
              <div
                className="absolute w-[16px] h-[0px] border border-white"
              ></div>
            </button>
          </div>
        ))}
      </div>

      {/* Email Input and Invite Button */}
      <div className="mt-4 space-y-2 flex flex-col items-center">
        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter member email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-[207px] h-[22px] bg-white border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-lime-400 mx-auto text-center"
        />
        {/* Invite Button */}
        <button
          onClick={handleButtonClick}
          className="w-[207px] h-[29px] bg-[#BCD3B5]/50 text-[#3C533A] rounded-lg text-sm hover:bg-[#BCD3B5]/70 mx-auto text-center"
        >
          + Invite Member
        </button>
		
      </div>
	  <div className="flex flex-col items-center ustify-center mt-20">
		{/* Delete Trip Button */}
			<button
				onClick={handleButtonClick}
				className="w-[271px] h-[46px] bg-[#D86D6D]/50 textg-[#FFFFFF] rounded-lg text-sm hover:bg-[#D86D6D]/70 mx-auto text-center"
				
				>
				Delete Trip
			</button>
	   </div>

    </div>
  );
};


export default ToadCountComponent;
