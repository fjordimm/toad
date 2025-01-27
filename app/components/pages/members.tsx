import React from "react";

{/* put names of members in trips here */}
interface ToadMemberProps {
  name: string;
}

const ToadMembers: React.FC<ToadMemberProps> = ({ name }) => {

  return (
    <div className="relative w-[148px] h-[28px] bg-[#8FA789]/40 rounded-lg shadow-sm">
      {/* Circle representing the color icon */}
      <div
        className="w-[18.86px] h-[18.86px] bg-white rounded-full absolute left-[8px] top-1/2 transform -translate-y-1/2"
      ></div>

      {/* Name */}
      <span className="text-[#3C533A] font-sunflower text-sm ml-[50px] leading-[30px]">
        {name}
      </span>

      {/* Delete Button */}
      <button
        className="absolute left-[160px] w-[28px] h-[26px] top-1/2 transform -translate-y-1/2 bg-[#EACBAC] rounded-lg flex items-center justify-center hover:bg-[#EACBAC]/80"
      >
        <div className="absolute w-[16px] h-[0px] border border-white"></div>
      </button>
    </div>
  );
};

export default ToadMembers;
