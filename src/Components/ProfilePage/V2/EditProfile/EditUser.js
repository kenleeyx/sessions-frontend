import React, {  useState } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/20/solid";
import apiRequest from "../../../../api";
import Select from "react-select";

export function EditUser({ pageOwnerInfo }) {
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [userInfo, setUserInfo] = useState({
    fullName: pageOwnerInfo?.fullName,
    password: pageOwnerInfo?.password,
    profilePictureUrl: pageOwnerInfo?.profilePictureUrl,
    bio:pageOwnerInfo?.bio,
    careerStatus:pageOwnerInfo?.careerStatus,
    experience:pageOwnerInfo?.experience,
    email:pageOwnerInfo?.email
});

const careerStatusList = [
    {value:'Amateur', label:'Amateur(I play for fun)'},
    {value:'Semi-Pro', label:'Semi-Pro(I sometimes make a few bucks playing)'},
    {value: 'Full-time music student', label:'Full-time music student'},
    {value:'Professional', label:'Professional(This is my full time job)'},
    {value:'Educator', label:'Educator'},
  ]

  const handleSelectChange = (e) => {
    setUserInfo((prevState) => {
      return { ...prevState, careerStatus: e.value};
    });
  };

  const writeData = async () => {
    const response = await apiRequest.put(
      `users/${pageOwnerInfo.id}/`, // to edit later
       userInfo,
    );
    console.log(response.data)
    setUserInfo(response.data.editedUser[1][0]);
    setIsBeingEdited(false);
  };

  const revertData = async () => {
    const storedUserInfo = await apiRequest.get(`users/getCurrentUser`);
    setIsBeingEdited(false);
    setUserInfo(storedUserInfo.data.user); // we need to edit this later based on what comes out of storedUserInfo
  }

    const userInfoChange = (e) => {
        const name = e.target.id;
        const value = e.target.value;
        setUserInfo((prevState) => {
            return { ...prevState, [name]: value };
        });
    }

  return (
    <div className = 'py-[1em]'>
    {console.log(userInfo.experience)}
      <div className="flex flex-row">
        <h1 className="font-bold text-txtcolor-primary text-[1.2rem] text-left ">
          USER PROFILE
        </h1>
        <label for={`editButton-user`}>
          { !isBeingEdited ? (
            <PencilSquareIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
          ) : null}
        </label>
        <button
          onClick={() => setIsBeingEdited(true)}
          id={`editButton-user`}
          style={{ display: "none" }}
        />
      </div>
          <section id='Name'>
              <p className="font-bold text-slate-800 text-sm">Full Name: &nbsp;</p> 
              {isBeingEdited ? // figure out why the font bold isn;t working
                  <input
            className='border border-slate-300'
            type="text"
            id="fullName"
            placeholder="Full Name"
            value={userInfo.fullName}
                      onChange={(e) => { userInfoChange(e); }}
                  />
                  : userInfo.fullName}
              <br />
          </section>
          <br />
          <section id='Career Role'>
              <p className="font-bold text-slate-800 text-sm">Role:</p> I am a &nbsp;
              {isBeingEdited ?
                  <Select // we need to figure out how to style this...
                      size="10"
                      options={careerStatusList}
                      value={{ value: userInfo.careerStatus, label: userInfo.careerStatus }}
                      onChange={(e) => handleSelectChange(e)}
                  />
                  : userInfo.careerStatus}

                  &nbsp;

                  {isBeingEdited ? 
                  <p>
                  with &nbsp; 
                  <input
                    className = 'border border-slate-300 w-[2em]'
                      type="number"
                      size = "1"
                      id="experience"
                      value={userInfo.experience}
                      onChange={(e) => { userInfoChange(e); }}
                  />
                  &nbsp; years of experience
                  </p>
                  :  userInfo.careerStatus !== 'Amateur' && pageOwnerInfo.experience ? 
                  `with ${userInfo.experience} years of experience` : null
                  }
          
          </section>
          <br />
          <section id = 'Bio' className="flex flex-col ">
              <p className="font-bold text-slate-800 text-sm ">BIO:</p>
              {isBeingEdited ? (
                  <div className='bg-white flex justify-center'>
                      <textarea
                      className='border border-slate-300'
                          type="text"
                          id="bio"
                          placeholder="Bio"
                          value={userInfo.bio}
                          rows="6"
                          cols="37"
                          onChange={(e) => { userInfoChange(e); }}
                      />
                  </div>
              ) : (
                  userInfo.bio
              )}
              {isBeingEdited ? (
          <div className="flex flex-row justify-center">
            <label for={`confirmButton-user`}>
            <div className = "flex flex-row bg-green-200 rounded-lg p-0.5 m-2 font-semibold shadow-md">
            Save changes
              <CheckCircleIcon className="h-6 w-6 text-green-500 cursor-pointer" />
              </div>
            </label>
            <button
              id={`confirmButton-user`}
              style={{ display: "none" }}
              onClick={() => {
                writeData();
              }}
            />
            <label for={`rejectButton-user`}>
            <div className = "flex flex-row bg-red-200 rounded-lg p-0.5  m-2 font-semibold shadow-md">
            Cancel
              <XCircleIcon className="h-6 w-6 text-red-500 cursor-pointer" />
              </div>
            </label>
            <button
              id={`rejectButton-user`}
              style={{ display: "none" }}
              onClick={() => {
                revertData();
              }}
            />
          </div>
        ) : null}
          </section>
      </div>
  );
}
