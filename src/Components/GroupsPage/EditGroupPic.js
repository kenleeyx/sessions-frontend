import React, {useState} from "react";
import apiRequest from "../../api";
import { storage } from "../../firebase/firebase";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { XCircleIcon, PencilSquareIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

export function EditGroupPic({ groupId, storedURL, onEditSaved }) {
  const [groupPicture, setGroupPicture] = useState(null);
  const [groupPictureURL, setGroupPictureURL] = useState(storedURL);
  const [isBeingEdited, setIsBeingEdited] = useState(false);

const updateGroupPicture = async () => {
  setIsBeingEdited(false);
  const fileRef = sRef(storage, `grouppics/${groupId}`);
  uploadBytes(fileRef, groupPicture)
    .then(() => getDownloadURL(fileRef))
    .then(async (url) => {
      try {
        await apiRequest.put(
          `groups/edit/${groupId}`,
          {
            profilePictureUrl: url,
          }
        );
        // Update the state to trigger a re-render
        setGroupPictureURL(url);
        onEditSaved(url);
      } catch (error) {
        console.error("Error updating group picture:", error);
      }
    });
};

  const revertChanges = () => {
    setIsBeingEdited(false);
    setGroupPictureURL(storedURL);
  };

  return (
    <div className="flex flex-col items-center pb-[2em] relative">
      <div className="w-[15em] h-[15em] rounded-full overflow-hidden">
        <img
          src={groupPictureURL}
          alt="Group"
          className="h-full w-full object-cover"
        />
      </div>
      <input
        type="file"
        id="group-picture"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          setGroupPicture(e.target.files[0]);
          setGroupPictureURL(URL.createObjectURL(e.target.files[0]));
          setIsBeingEdited(true);
        }}
      />
      <label htmlFor="group-picture" className="cursor-pointer">
        {!isBeingEdited ? (
          <div class="absolute top-0 right-[10%] z-[30] bg-white rounded-[50%] w-[4em] h-[4em] border border-blue-800 flex justify-center items-center">

          <PencilSquareIcon className="h-8 w-8 text-gray-500" />
          </div>
        ) : null}
      </label>
      {isBeingEdited && (
        <div className="flex flex-row p-2">
          <p className="mx-2">Confirm new group picture?</p>
          <CheckCircleIcon
            className="h-6 w-6 text-green-500 cursor-pointer"
            onClick={updateGroupPicture}
          />
          <XCircleIcon
            className="h-6 w-6 text-red-500 cursor-pointer"
            onClick={revertChanges}
          />
        </div>
      )}
    </div>
  );
}

