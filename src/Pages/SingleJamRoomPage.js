import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Import Components
import { SpeechBubble } from "../Components/SpeechBubble/SpeechBubble";
import { AttachmentModal } from "../Components/AttachmentModal/AttachmentModal";

// Import Sockets
import { io } from "socket.io-client"; // io is a function to call an individual socket. the package for frontend(client side) is npm i socket.io-client
const socket = io(`http://localhost:8080`);

export const SingleJamRoomPage = () => {
  const [socketRoomId, setSocketRoomId] = useState(null);
  const [roomData, setRoomData] = useState("");
  const [roomDetails, setRoomDetails] = useState("");
  const [roomUsers, setRoomUsers] = useState("");
  const [roomAttachments, setRoomAttachments] = useState("");

  const [userMessage, setUserMessage] = useState("");
  const [currentTypingUser, setCurrentTypingUser] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [attachmentModalToggle, setAttachmentModalToggle] = useState(false);

  const myRef = useRef(null);

  const { chatroomId } = useParams();
  const userId = 1; // Need to tie in with Auth

  // The URL of the backend goes into the socket
  //// const socket = io(`${process.env.REACT_APP_BACKEND_URL}`); // Doesnt work, Express server is on 8000. So we'll use 8080 for sockets.
  socket.on("connect", () => {
    console.log(`You connected with id: ${socket.id}`);
    // Need to send to server the CHAT ID.
  });

  // Make a separate axios.get to get information about specific jamroom.
  useEffect(() => {
    console.log("join room ", chatroomId);
    socket.emit("join-room", chatroomId);
    getChatroomDetails();
    getChatroomInfo();
    getChatroomUsers();
    getChatroomAttachments();
  }, []);

  // Interval for checking user-typing emit from server
  useEffect(() => {
    // checkTyping();
    let myInterval = setInterval(() => {
      console.log("interval 3s passed");
      setIsTyping(false);
    }, 4000);
    console.log(`interval ${myInterval} started`);

    return () => {
      console.log("clearing interval");
      clearInterval(myInterval);
    };
  }, []);

  useEffect(() => {
    socket.on("receive-message", (receiveddata) => {
      console.log("received-message from server: ", receiveddata);
      setRoomData((prevState) => {
        return [...prevState, receiveddata];
      });
      console.log("received message");
    });

    socket.on("user-typing-response", (typinguser) => {
      console.log(`User of Id ${typinguser} is typing`);
      // console.log("user typing, socket id is: ", socket.id);
      setIsTyping(true); // Displays typing message
      setCurrentTypingUser(typinguser);
    });

    socket.on("refresh-attachments", () => {
      getChatroomAttachments();
    });
  }, [socket]);

  const handleSubmitMessage = (ev) => {
    ev.preventDefault();
    postNewMessage();
  };

  /** BACKEND REQUESTS */
  const getChatroomInfo = async () => {
    let chatroomInfo = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/chatrooms/${chatroomId}/getAllChatroomMessages`
    );

    if (chatroomInfo.data.success === true) {
      setRoomData(chatroomInfo.data.data);
    } else {
      alert("Unable to get specific chatroom data.");
    }
  };

  const getChatroomDetails = async () => {
    let chatroomDetails = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/chatrooms/${chatroomId}/getChatroomDetails`
    );

    if (chatroomDetails.data.success === true) {
      setRoomDetails(chatroomDetails.data.data);
    } else {
      alert("Unable to get Chatroom Details");
    }
  };

  const getChatroomUsers = async () => {
    let allUsers = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/chatrooms/${chatroomId}/getAllChatroomUsers`
    );

    if (allUsers.data.success === true) {
      setRoomUsers(allUsers.data.data);
    } else {
      alert("Unable to get Chatroom Details");
    }
  };

  const getChatroomAttachments = async () => {
    let allAttachments = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/chatrooms/${chatroomId}/getAllChatroomAttachments`
    );

    if (allAttachments.data.success === true) {
      console.log("SUCCESSFUL TRUE");
      setRoomAttachments(allAttachments.data.data);
    } else {
      alert("Unable to get Chatroom Attachements");
    }
  };

  const postNewMessage = async () => {
    if (userMessage) {
      let newMessage = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/users/postNewMessage`,
        {
          userId: userId,
          chatroomId: chatroomId,
          content: userMessage.message,
        }
      );

      // console.log("Sent your message!");
      setRoomData((prevState) => {
        return [...prevState, newMessage.data.data];
      });

      // console.log(`Sending message to backend: ${userMessage}`);
      // Need to send the entire Request Response rather than the state.
      socket.emit("send-message", newMessage.data.data, chatroomId);
    } else {
      console.log("Please key in a message");
    }
  };

  // Handle Text Input
  const handleTextChange = (ev) => {
    let name = ev.target.name;
    let value = ev.target.value;

    setUserMessage((prevState) => {
      return { ...prevState, [name]: value };
    });

    socket.emit("user-typing", userId, chatroomId);
  };

  // Filter Individual Message Details into each Speech Bubble.
  // (As opposed to each Speech Bubble making 1 BE call each, we re-use the information we called earlier)
  const checkUser = (messageDetails) => {
    let list = [...roomUsers];
    let results = list.filter((item) => item.id == messageDetails.authorId);
    return results;
  };

  const checkMessageId = (messageDetails) => {
    let list = [...roomAttachments];
    let results = list.filter((item) => item.messageId == messageDetails.id);
    return results;
  };

  const handleAttachmentModal = () => {
    setAttachmentModalToggle(!attachmentModalToggle);
  };

  const removeModal = () => {
    setAttachmentModalToggle(false);
  };

  return (
    <>
      <div className="flex flex-row justify-center h-[100dvh] pt-[2em] pb-[4em] px-[2em] ">
        <div className="flex flex-col w-full lg:w-[30%] justify-between overflow-x-hidden overflow-y-auto">
          <div className="flex flex-col pt-[0em] mb-[0em] h-[100%]">
            <h1 className="font-bold text-txtcolor-primary text-[1.5rem] text-center balance">
              {roomDetails && roomDetails.name}
            </h1>
            <div className="h-[10%] text-sm text-slate-800 text-center pt-1 pb-0 mb-0 ">
              {isTyping ? `User ${currentTypingUser} is typing...` : null}
            </div>

            <button
              onClick={() => {
                console.log(roomAttachments);
              }}
              className="bg-red-500 px-2 py-1"
            >
              View room data state
            </button>
            <br />

            {/* Sorting message left and right by user logged in */}
            <div
              ref={myRef}
              className="pr-[1.5em] h-[100%] mb-[1em] py-[1em] border-b-[1px] border-t-[1px] border-slate-300 overflow-y-auto"
            >
              {roomData &&
                roomData.map((elementdata, index) => {
                  if (elementdata.authorId === userId) {
                    return (
                      <>
                        <div
                          key={index}
                          className="flex flex-row justify-end pb-[1em]"
                        >
                          <SpeechBubble
                            messagedata={elementdata}
                            index={index}
                            userinfo={checkUser(elementdata)[0]}
                            attachmentinfo={checkMessageId(elementdata)[0]}
                          />
                        </div>
                      </>
                    );
                  } else
                    return (
                      <>
                        <div
                          key={index}
                          className="flex flex-row justify-start pb-[1em]"
                        >
                          <SpeechBubble
                            messagedata={elementdata}
                            index={index}
                            userinfo={checkUser(elementdata)[0]}
                            attachmentinfo={checkMessageId(elementdata)[0]}
                          />
                        </div>
                      </>
                    );
                })}
            </div>

            <div className="flex flex-col justify-end h-[20%] gap-[1em] mt-[1em] lg:mt-[.5em] pr-[1.5em] text-right">
              <div>
                <textarea
                  type="text"
                  name="message"
                  onChange={handleTextChange}
                  value={userMessage.message}
                  autoComplete="off"
                  placeholder="message"
                  className="bg-white w-[100%] h-[100%] p-[1em] rounded-md border-slate-400 border-[1px] focus:outline-none"
                />
              </div>
              <div>
                <button
                  onClick={handleAttachmentModal}
                  className="bg-slate-700 px-[1em] py-[.2em] text-white font-semibold rounded-md active:outline-none scale-100 transition-all active:scale-95 mr-[1em]"
                >
                  UPLOAD
                </button>

                <button
                  onClick={handleSubmitMessage}
                  className="bg-fill-secondary px-[1em] py-[.2em] text-white font-semibold rounded-md active:outline-none scale-100 transition-all active:scale-95"
                >
                  SEND
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MODALS GO HERE */}
        {attachmentModalToggle && (
          <AttachmentModal
            removeModal={removeModal}
            userId={userId}
            setRoomData={setRoomData}
            chatroomId={chatroomId}
            refreshAttachments={getChatroomAttachments}
          />
        )}
        {attachmentModalToggle && (
          <div
            onClick={removeModal}
            className="fixed top-0 left-0 w-[100vw] h-full bg-black z-[9] transition-all opacity-50"
          ></div>
        )}
      </div>
    </>
  );
};
