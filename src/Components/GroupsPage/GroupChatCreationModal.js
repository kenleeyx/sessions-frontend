import React, { useState, useEffect, useContext } from "react";
import apiRequest from "../../api";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";

export const GroupChatCreationModal = ({ groupId, groupName, onClose }) => {
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  // const { userId } = useContext(UserContext);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch group members
    const getCurrentUser = async () => {
      let currentUserInfo = await apiRequest.get(
        `users/getCurrentUser`
      );
      setUserId(currentUserInfo.data.user.id);
    };

    getCurrentUser();

    const fetchMembers = async () => {
      try {
        const response = await apiRequest.get(`groups/${groupId}/members`); 
        setMembers(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching group members:", error);
      }
    };

    fetchMembers();
  }, [groupId]);

  const handleSelectMember = (member) => {
    setSelectedMembers((prevSelected) =>
      prevSelected.find((m) => m.id === member.id)
        ? prevSelected.filter((m) => m.id !== member.id)
        : [...prevSelected, member]
    );
  };

    const isSelected = (memberId) => {
      return selectedMembers.some((member) => member.id === memberId);
    };

    const handleAddAllAdmins = () => {
      const allAdmins = members.filter(
        (member) => member.isAdmin && member.id !== userId
      );
      setSelectedMembers(allAdmins);
    };

    const handleAddAllMembers = () => {
      const allMembers = members.filter((member) => member.id !== userId);
      setSelectedMembers(allMembers);
    };

  const createChat = async () => {
    console.log('foo')
    console.log(userId)
    // collect the IDs of the selected members 
    const memberIds = selectedMembers.map((member) => member.id);

    // include the userId of the creator 
    if (!memberIds.includes(userId)) {
      memberIds.push(userId);
    }

    const memberIdsObject = memberIds.reduce((obj, memberId, index) => {
      return { ...obj, [index + 1]: memberId };
    }, {});

    try {
      // Send a POST request to your backend to create a new chat room.
      const response = await apiRequest.post(
        `users/createNewChatroomForMany`,
        {
          memberIds: memberIdsObject,
          name: groupName,
          description: "", 
          genresPlayed: "", 
          instrumentsWanted: "", 
        }
      );

      console.log("Chat room created:", response.data);
     if (response.data.success && response.data.data.length > 0) {
       const chatRoomId = response.data.data[0].chatroomId; 

       console.log("Chat room created with ID:", chatRoomId);

       navigate(`/${chatRoomId}/jamroom`);

       onClose();
     } else {
       console.error("Chat room was not created or data is missing.");
     }} catch (error) {
      console.error("Error creating chat room:", error);
    }
  };


  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto shadow-lg rounded-md bg-white max-w-md">
            <div className="p-4" style={{ maxHeight: '750px', overflowY: 'auto' }}>

        <div className="relative bg-gray-200 text-xl px-4 py-2">
          <div className="absolute top-2 right-2">
            <button onClick={onClose}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="text-center py-2">
            <div>CREATE CHAT WITH:</div>
            <h2 className="text-2xl text-yellow-400 font-bold">{groupName}</h2>
          </div>
        </div>
        <div className="p-4">
          {/* List of selected members */}
          <div className="space-y-2">
            {selectedMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between bg-blue-200 p-2 rounded"
              >
                <div className="flex items-center">
                  <img
                    src={member.profilePictureUrl}
                    alt={member.fullName}
                    className="h-10 w-10 rounded-full mr-2"
                  />
                  <span className="font-bold text-blue-800">
                    {member.fullName}
                  </span>
                </div>

                <button onClick={() => handleSelectMember(member)}>
                  <XMarkIcon className="h-6 w-6 text-red-500" />
                </button>
              </div>
            ))}
          </div>

          {/* Add all members/admins buttons */}
          <div className="flex flex-col items-start space-y-2 mt-3 mb-2">
            <button
              className="text-sm bg-blue-200 hover:bg-blue-300 text-blue-800 font-bold py-1 px-3 rounded text-left"
              onClick={handleAddAllAdmins}
            >
              + All Admins
            </button>
            <button
              className="text-sm bg-blue-200 hover:bg-blue-300 text-blue-800 font-bold py-1 px-3 rounded text-left"
              onClick={handleAddAllMembers}
            >
              + All Members
            </button>
          </div>

          <div>
            <div className="text-xl text-yellow-400 font-bold mt-3 mb-2">
              <div>USERS:</div>
            </div>
            {members
              .filter((member) => member.id !== userId) // filter out the current user
              .map((member) => (
                <div
                  key={member.id}
                  className={`flex items-center cursor-pointer p-2 rounded ${
                    isSelected(member.id) ? "bg-blue-100" : ""
                  }`}
                  onClick={() => handleSelectMember(member)}
                >
                  <img
                    src={member.profilePictureUrl}
                    alt={member.fullName}
                    className="h-10 w-10 rounded-full"
                  />
                  <span
                    className={`ml-2 ${
                      isSelected(member.id) ? "font-bold" : ""
                    }`}
                  >
                    {member.fullName}
                  </span>
                  {member.isAdmin && (
                    <span className="ml-2 text-sm text-gray-500">(Admin)</span>
                  )}
                </div>
              ))}
          </div>

          <div className="flex justify-center mt-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={createChat}
            >
              Create chat
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
