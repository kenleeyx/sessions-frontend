import React, { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/20/solid";
import apiRequest from "../../../../api";
import Select from "react-select";

export function EditInstruments({ displayedUserId }) {
  const [userInstrumentsList, setUserInstrumentsList] = useState([]);
  const [fullInstrumentsList, setFullInstrumentsList] = useState([]);
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [newInstrument, setNewInstrument] = useState({
    instrument: { value: "", label: "" },
    highestQualification: { value: "", label: "" },
    qualificationInstitution: "",
  });

  useEffect(() => {
    const getUserInstrumentsInfo = async () => {
      const userInstrumentsInfo = await apiRequest.get(`users/${displayedUserId}/instruments`);
      setUserInstrumentsList(userInstrumentsInfo.data.playedInstruments);
    };
    const getFullInstrumentsList = async () => {
      const fullInstrumentsInfo = await apiRequest.get(`instruments/selectable`);
      setFullInstrumentsList(fullInstrumentsInfo.data);
    };
    getUserInstrumentsInfo();
    getFullInstrumentsList();
  }, []);

  const fullQualificationsList = [
    {value:'Self Taught', label:'Self Taught'},
    {value:'Low Grade(eg ABRSM 1-5)', label:'Low Grade(eg ABRSM 1-5)'},
    {value:'High Grade(eg ABRSM 6-8)', label:'High Grade(eg ABRSM 6-8)'},
    {value:'Diploma', label:'Diploma'},
    {value:"Bachelor's degree", label: "Bachelor's degree"},
    {value:"Master's degree", label: "Master's degree"},
    {value:"Doctorate", label: "Doctorate"},
  ]

  const writeData = async () => {
    setIsBeingEdited(false);
    await apiRequest.put(
      `users/${displayedUserId}/instruments`,
      {
        userInstrumentsList,
      },
    );
  };

  const revertData = async () => {
    const instrumentInfo = await apiRequest.get(`users/${displayedUserId}/instruments`);
    setIsBeingEdited(false);
    setUserInstrumentsList(instrumentInfo.data.playedInstruments);
  };

  const addRow = () => {
    const instrumentNames = new Set(
      userInstrumentsList.map((entry) => entry.instrument.label)
    );
    if (instrumentNames.has(newInstrument.instrument.label)) {
      alert(
        "Instrument is already listed, please delete previous entry and try again"
      );
    } else {
      setUserInstrumentsList((prevState) => {
        prevState.push(newInstrument);
        return [...prevState];
      });
      setNewInstrument({
        instrument: { value: "", label: "" },
        highestQualification: { value: "", label: "" },
        qualificationInstitution: "",
      });
    }
  };

  const removeRow = (index) => {
    setUserInstrumentsList((prevState) => {
      prevState.splice(index, 1);
      return [...prevState];
    });
  };

  const inputChange = (e) => {
    const name = e.target.id;
    const value = e.target.value;
    setNewInstrument((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleInstrumentChange = (e) => {
    setNewInstrument((prevState) => {
      return { ...prevState, instrument: e };
    });
  };

  const handleQualificationChange = (e) => {
    console.log(e)
    setNewInstrument((prevState) => {
      return { ...prevState, highestQualification: e };
    });
  };

  const instrumentRows = userInstrumentsList.map((entry, index) => {
    return (
        <div className='flex flex-row m-2'>
            <div className = 'text-sm w-5/6'>
                <div className = 'text-lg'>{entry.instrument.label.toUpperCase()} </div>
                {entry.highestQualification.label}
                {entry.qualificationInstitution ? ' from ' + entry.qualificationInstitution : null}
            </div>
            {isBeingEdited ? (
                <div className = 'flex justify-center items-center w-1/6'>
                    <label for={`deleteRow-instruments-${index}`}>
                        <TrashIcon class="h-6 w-6 text-gray-500 cursor-pointer" />
                    </label>
                    <button
                        onClick={() => removeRow(index)}
                        id={`deleteRow-instruments-${index}`}
                        style={{ display: "none" }}
                    />
                </div>
            ) : null}
        </div>
    );
  });

  const newEntryRow = (
    <div className = 'flex flex-col'>
        <Select // we need to figure out how to style this...
        className = 'my-[0.5em]'
          defaultValue={{ value: "Instrument", label: "Instrument" }}
          size="10"
          options={fullInstrumentsList}
          value={newInstrument.instrument}
          onChange={(e) => handleInstrumentChange(e)}
        />
      
      <Select 
      className = 'my-[0.5em]'
          defaultValue={{ value: "Qualification", label: "Qualification" }}
          size="10"
          options={fullQualificationsList}
          value={newInstrument.highestQualification}//need to rework this into the react select format
          onChange={(e) => handleQualificationChange(e)}
        />
        <input
        className = 'border border-black my-[0.5em]'
          placeholder="Institution"
          type="text"
          name="institution"
          id="qualificationInstitution"
          size="10"
          value={newInstrument.qualificationInstitution}
          onChange={(e) => {
            inputChange(e);
          }}
        />
        <div className = 'flex flex-row items-center my-[0.5em]'>
        <p className = 'text-xl font-normal'>Add Instrument</p>
        <label for={`addRow-instruments`}>
          <PlusCircleIcon class="h-6 w-6 text-gray-500 cursor-pointer" />
        </label>
        <button
          onClick={() => addRow()}
          id={`addRow-instruments`}
          style={{ display: "none" }}
        />
        </div>
    </div>
  );

  return (
    <div>
    <hr />
      <div className="flex flex-row">
        <h1 className="font-bold text-txtcolor-primary text-[1.2rem] text-left">
          INSTRUMENTS
        </h1>
        {isBeingEdited ? (
          <div className="flex flex-row">
            <label for={`confirmButton-instruments`}>
              <CheckCircleIcon className="h-6 w-6 text-green-500 cursor-pointer" />
            </label>
            <button
              id={`confirmButton-instruments`}
              style={{ display: "none" }}
              onClick={() => {
                writeData();
              }}
            />
            <label for={`rejectButton-instruments`}>
              <XCircleIcon className="h-6 w-6 text-red-500 cursor-pointer" />
            </label>
            <button
              id={`rejectButton-instruments`}
              style={{ display: "none" }}
              onClick={() => {
                revertData();
              }}
            />
          </div>
        ) : null}
        <label for={`editButton-instruments`}>
          { !isBeingEdited ? (
            <PencilSquareIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
          ) : null}
        </label>
        <button
          onClick={() => setIsBeingEdited(true)}
          id={`editButton-instruments`}
          style={{ display: "none" }}
        />
      </div>
      <div className="text-[1.5rem] font-semibold leading-[1.2em] pr-[1em]">  
            {instrumentRows}
            {isBeingEdited ? newEntryRow : null}      
      </div>
    </div>
  );
}
