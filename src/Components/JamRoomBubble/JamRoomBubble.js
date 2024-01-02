import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {timeConversion} from "../../utilities.js"

export const JamRoomBubble = ({ roomdata }) => {
  const handleClick = () => {
    console.log(
      "navigate to that chatroom! maybe a modal? But modal means you can't have a shortcut to that room via the URL. let's think abt it"
    );
  };

  /**
   * All the info will come from BE, and passed in as an object.
   * so probably the displayed info below will be like:
   * {roomdata.name} , {roomdata.genre} etc, we'll see
   */



  return (
    <>
      <NavLink to={`/${roomdata.id}/jamroom`}>
        <div className="w-[full] min-h-[7em] bg-white rounded-lg border py-[1em] px-[1em] shadow-sm scale-100 transition-all origin-left hover:scale-[102%] active:scale-[97%]">
          <h1 className="font-semibold text-[1.2rem] text-slate-700">
            {roomdata && roomdata.name}
          </h1>
          <p className="font-medium text-[1.2rem] text-txtcolor-primary balance">
            {roomdata && roomdata.genresPlayed}
          </p>
          <p className="font-medium text-black text-[1rem]">Looking For:</p>
          <p>
            {roomdata.instrumentsWanted //make sure this is a string or it might not work
              ? roomdata.instrumentsWanted
              : "Not looking for any particular instruments"}
          </p>

          <p className="py-[1em]">{roomdata && roomdata.description}</p>
          <p className = "font-sans italic">Last message: {roomdata && timeConversion(roomdata.updatedAt)}</p>
        </div>
      </NavLink>
    </>
  );
};
