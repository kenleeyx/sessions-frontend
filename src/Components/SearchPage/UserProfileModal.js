import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import apiRequest from "../../api";
import { useNavigate } from "react-router-dom";

// Import Components
import { Username } from "../../Components/ProfilePage/Username";
import { Bio } from "../../Components/ProfilePage/Bio";
import { InstrumentTable } from "../../Components/ProfilePage/InstrumentTable";
import { ArtistList } from "../../Components/ProfilePage/ArtistList";
import { GenreList } from "../../Components/ProfilePage/GenreList";



// Import Sockets
import { io } from "socket.io-client"; // io is a function to call an individual socket. the package for frontend(client side) is npm i socket.io-client
const socket = io(process.env.REACT_APP_BACKEND_URL);

export const UserProfileModal = ({ pageOwnerUserId, removeModal }) => {


    const [pageOwnerInfo, setPageOwnerInfo] = useState(null)
    const [isOwnPage, setIsOwnPage] = useState(false); 
    const [textField, setTextField] = useState({ roomname: "" });
    const [isBeingEdited, setIsBeingEdited] = useState(false);
  
    const numberOfSessions = "65";
    const uniqueCollaborators = "30";

    const navigate = useNavigate();

    useEffect(()=>{
        const getUserInfo = async () => {
          const retrievedPageOwnerInfo = await apiRequest.get(`${process.env.REACT_APP_BACKEND_URL}/users/${pageOwnerUserId}`)
          setPageOwnerInfo(retrievedPageOwnerInfo.data.user)
        }
    getUserInfo();
  }, []);

  const handleCreateRoomForTwo = async () => {
    if (textField.roomname != "") {
      const createdRoom = await apiRequest.post(
        `${process.env.REACT_APP_BACKEND_URL}/users/createNewChatroomForTwo`,
        {
          secondUserId: pageOwnerInfo.id,
          name: textField.roomname,
          genresPlayed: "",
          instrumentsWanted: "",
        },
      );
      const chatRoomId = createdRoom.data.data[0][0].chatroomId;
      alert("Room Created!");
      socket.emit("create-room-for-two", pageOwnerUserId);
      removeModal();
      navigate(`/${chatRoomId}/jamroom`)
    } else {
      alert("Please key in at least one valid character");
    }
  };

  const handleTextChange = (ev) => {
    let name = ev.target.name;
    let value = ev.target.value;

    setTextField((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  return (
    <>
      <div className="overflow-y-auto absolute flex flex-col top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90%] md:w-[50%] lg:w-[40%] h-[80%] bg-white rounded-md border py-[2em] px-[1em] shadow-sm z-[90] gap-[1em]">
        <div className="flex flex-row w-full h-[30%] justify-center">
          <div className="aspect-square mr-[1em] rounded-[50%] overflow-hidden ">
            <img
              src={pageOwnerInfo ? pageOwnerInfo.profilePictureUrl : null}
              alt="face"
              className="h-[100%] w-[100%] object-cover"
            />
          </div>
        </div>

        <div className="flex flex-row justify-center items-center h-[100%] gap-[0em] mb-[300px] lg:mb-[4em]">
          <div className="flex flex-col gap-[1em] h-[100%] lg:w-[60%] md:w-[70%] w-[80%] py-[1em] ">
            {pageOwnerInfo ? (
              <Username
                isOwnPage={isOwnPage}
                displayedUserId={pageOwnerUserId}
                storedUsername={pageOwnerInfo.fullName}
              />
            ) : null}
            <InstrumentTable
              isOwnPage={isOwnPage}
              displayedUserId={pageOwnerUserId}
            />

            <div className="flex flex-row flex-wrap gap-[1em]">
              <div>
                <h1 className="font-bold text-txtcolor-primary text-[1.2rem] text-left">
                  SESSIONS
                </h1>
                <p className="text-[3rem] font-semibold leading-[1em]">
                  {numberOfSessions}
                </p>
              </div>

              <div>
                <h1 className="font-bold text-txtcolor-primary text-[1.2rem] text-left ">
                  UNIQUE JAM BUDDIES
                </h1>
                <p className="text-[3rem] font-semibold leading-[1em]">
                  {uniqueCollaborators}
                </p>
              </div>
            </div>
            {pageOwnerInfo ? (
              <Bio
                isOwnPage={isOwnPage}
                displayedUserId={pageOwnerUserId}
                storedBio={pageOwnerInfo.bio}
              />
            ) : null}

            <GenreList
              isOwnPage={isOwnPage}
              displayedUserId={pageOwnerUserId}
            />
            <ArtistList
              isOwnPage={isOwnPage}
              displayedUserId={pageOwnerUserId}
            />
            <div>
              {!isBeingEdited ? <input
                type="button"
                value="CREATE ROOM WITH ME!"
                onClick={() => setIsBeingEdited(true)}
                className="secondary-cta-btn w-[100%] lg:w-[100%]"
              /> : null}
              {isBeingEdited ?
                <>
                  {/* <div className="">
              <p className="text-slate-800 font-semibold text-center text-txtcolor-primary text-[2rem] mt-[0em] lg:mt-[1em] md:mt-[1em]">
                JAM WITH ME?
              </p> */}
                  <input
                    type="text"
                    name="roomname"
                    onChange={handleTextChange}
                    value={textField.roomname}
                    autoComplete="off"
                    placeholder="JAM ROOM NAME?"
                    className="primary-input-form text-center"
                  />
                  <input
                    type="button"
                    value="Confirm Create"
                    onClick={handleCreateRoomForTwo}
                    className="secondary-cta-btn w-[100%] lg:w-[100%] mb-[1em]"
                  />
                </> : null
              }
            </div>
          </div>
        </div>

        <div
          className="fixed top-[1em] right-[1em] hover:cursor-pointer"
          onClick={removeModal}
        >
          <XMarkIcon className="h-6 w-6 text-txtcolor-secondary" />
        </div>
      </div>
    </>
  );
};
