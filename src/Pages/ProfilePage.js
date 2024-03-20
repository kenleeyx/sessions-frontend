import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../App.js";
import { useNavigate, useParams } from "react-router-dom";
import { InstrumentList } from "../Components/ProfilePage/V2/InstrumentList";
import { ArtistList } from "../Components/ProfilePage/V2/ArtistList";
import { GenreList } from "../Components/ProfilePage/V2/GenreList";
import { SessionClips } from "../Components/ProfilePage/V2/SessionClips";
import { Qualifications } from "../Components/ProfilePage/V2/Qualifications";
import { Connections } from "../Components/ProfilePage/V2/Connections";
import { EditProfileModal } from "../Components/ProfilePage/V2/EditProfileModal";
import { EditConnectionButton } from "../Components/Buttons/EditConnectionButton";
import { NotificationsButton } from "../Components/Buttons/NotificationsButton";
import { StartChatButton } from "../Components/Buttons/StartChatButton";
import { ArrowLeftIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { NotificationsModal } from "../Components/Buttons/NotificationsModal";
import apiRequest from "../api";

export const ProfilePage = ({ motion, loggedInUserId }) => {
  const { pageOwnerUserId } = useParams();
  const context = useContext(UserContext);
  const [userId, setUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [editProfileModalToggle, setEditProfileModalToggle] = useState(false);
  const [notificationsModalToggle, setNotificationsModalToggle] =
    useState(false);
  const [notificationReadStatus, setNotificationReadStatus] = useState(true);
  const [notificationStatusToggled, setNotificationStatusToggled] =
    useState(false);
  const [pageOwnerInfo, setPageOwnerInfo] = useState(null);
  const [isOwnPage, setIsOwnPage] = useState(null);
  const navigate = useNavigate();

  //Load info for the current user being displayed(also retrieved the logged in user's id)
  useEffect(() => {
    const getUserInfo = async () => {
      const pulledPageOwnerInfo = await apiRequest.get(
        `users/${pageOwnerUserId ? pageOwnerUserId : "getCurrentUser"}`);
      setPageOwnerInfo({ ...pulledPageOwnerInfo.data.user });
      setUserId(pulledPageOwnerInfo.data.ownId);
      setIsOwnPage(
        pulledPageOwnerInfo.data.ownId ===
          parseInt(pulledPageOwnerInfo.data.user.id)
      );
    };
    getUserInfo();
  }, [pageOwnerUserId, userId]);

  //Load notifications for the logged in user
  useEffect(() => {
    const getNotifications = async () => {
      const retrievedNotifications = await apiRequest.get(`notifications`);
      const readStatus = retrievedNotifications.data.notifications.reduce(
        (acc, notification) => {
          return acc && notification.hasBeenViewed;
        },
        true
      );
      setNotificationReadStatus(readStatus);
      setNotifications([...retrievedNotifications.data.notifications]);
    };
    if (isOwnPage) {
      getNotifications();
    }
  }, [notificationStatusToggled, isOwnPage]);

  const removeNotificationsModal = () => {
    setNotificationsModalToggle(false);
  };

  const handleEditProfileModal = () => {
    //may need some code to pass in the user ID here
    setEditProfileModalToggle(!editProfileModalToggle);
  };

  const removeModal = () => {
    setEditProfileModalToggle(false);
  };

  const handleLogOut = async () => {
    const accessToken = localStorage.getItem("token")
    const refreshToken = localStorage.getItem("refresh")
    const response = await apiRequest.put(`users/jwtLogOut`,
      {
        accessToken,
        refreshToken
      }
    )     
    localStorage.removeItem("token");
    localStorage.removeItem("refresh")
    context.setUserId(null);
    navigate("/");
  }

  return (
    <>
      <div className="flex flex-row justify-center h-[93dvh] pt-[2em] pb-[4em] px-[2em] w-full overflow-y-auto">
        {/* <div className="flex flex-col w-full lg:w-[30%] justify-between overflow-x-visible overflow-y-auto"> */}
        <div className="flex flex-col pt-[2em] mb-[-10em] w-full">
          <section className="w-full ">
            {pageOwnerUserId && pageOwnerInfo ? (
              <div>
                <button onClick={() => navigate(-1)}>
                  <ArrowLeftIcon class="h-6 w-6 text-gray-500" />
                </button>
              </div>
            ) : null}
          </section>
          <div className="overflow-visible">
            {pageOwnerInfo ? (
              <section>
                <div className="flex flex-col items-center pb-[1em] relative overflow-visible">
                  <div className="w-[15em] h-[15em] rounded-[50%] overflow-hidden shadow-md">
                    <img
                      src={pageOwnerInfo.profilePictureUrl}
                      alt="Profile photo"
                      className="h-full object-cover"
                    />
                  </div>

                  <div className="h-[10em] w-[2em] absolute top-10 -left-8 bg-blue-900 rounded-r-md z-[8] shadow-md shadow-black">
                    {isOwnPage ? (
                      <div className="flex flex-col h-full rounded-r-md justify-evenly items-center">
                        <button
                          className="text-white"
                          onClick={() => {
                            handleEditProfileModal();
                          }}
                        >
                          <PencilSquareIcon className="h-6 w-6 text-white cursor-pointer" />
                        </button>
                        <NotificationsButton
                          userId={pageOwnerUserId}
                          notificationReadStatus={notificationReadStatus}
                          notificationsModalToggle={notificationsModalToggle}
                          setNotificationsModalToggle={
                            setNotificationsModalToggle
                          }
                        />
                      </div>
                    ) : null}
                    {!isOwnPage && userId ? (
                      <div className="flex flex-col h-full rounded-r-md justify-evenly items-center">
                        <EditConnectionButton
                          requesterId={userId}
                          requestedId={pageOwnerUserId}
                          requestedName={pageOwnerInfo.fullName}
                        />
                        <StartChatButton
                          requestedId={pageOwnerUserId}
                          requesterName={context.userName}
                          requestedName={pageOwnerInfo.fullName}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="h-[0.5em] bg-yellow-300"></div>
                <h1 className="text-center font-bold text-3xl">
                  {pageOwnerInfo.fullName}
                </h1>
                <InstrumentList displayedUserId={pageOwnerInfo.id} />
                <GenreList displayedUserId={pageOwnerInfo.id} />
                <div className="h-[0.5em] bg-blue-800"></div>
              </section>
            ) : null}
          </div>
          <br />

          {pageOwnerInfo && (
            <div className="w-full">
              <SessionClips displayedUserId={pageOwnerInfo.id} />
            </div>
          )}

          {pageOwnerInfo ? (
            <div className="font-bold text-slate-800 text-sm flex flex-col py-[2em] ">
              <div className="flex flex-row">
                <h1 className="font-bold text-txtcolor-primary text-[1.2rem] text-left">
                  BIO
                </h1>
              </div>
              {pageOwnerInfo.bio}
            </div>
          ) : null}

          {pageOwnerInfo && <ArtistList displayedUserId={pageOwnerInfo.id} />}

          {pageOwnerInfo && (
            <Qualifications displayedUserId={pageOwnerInfo.id} />
          )}
          {pageOwnerInfo && <Connections displayedUserId={pageOwnerInfo.id} />}

          {/* LOGOUT BUTTON */}
          {isOwnPage ?
            (
              <div className="pt-[1.5em]">
                <form>
                  <input
                    type="button"
                    value="LOGOUT"
                    onClick={() => { handleLogOut() }}
                    className="secondary-cta-btn w-[100%] lg:w-[100%]"
                  />
                </form>
              </div>
            )
            : null
          }
        </div>
        {/* </div> */}

        {/* MODALS GO HERE */}
        {editProfileModalToggle && (
          <EditProfileModal removeModal={removeModal} />
        )}
        {editProfileModalToggle && (
          <div
            onClick={removeModal}
            className="fixed top-0 left-0 w-[100vw] h-full bg-black z-[9] transition-all opacity-50"
          ></div>
        )}
        {notificationsModalToggle && (
          <NotificationsModal
            notifications={notifications}
            userId={userId}
            setNotificationStatusToggled={setNotificationStatusToggled}
            removeModal={removeNotificationsModal}
          />
        )}
        {notificationsModalToggle && (
          <div
            onClick={removeNotificationsModal}
            className="fixed top-0 left-0 w-[100vw] h-full bg-black z-[9] transition-all opacity-50"
          ></div>
        )}
      </div>
    </>
  );
};
