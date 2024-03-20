import React, { useState, useEffect } from "react";
import Select from "react-select";
import { XCircleIcon } from "@heroicons/react/20/solid";
import apiRequest from "../../api";

export const CategoryBlock = ({ searchMode, category, filterCriteria, setFilterCriteria }) => {
    const [options, setOptions] = useState([])
    const [inputText, setInputText] = useState('')

    useEffect(() => {
        const getOptionsFromDatabase = async () => {
            const response = await apiRequest.get(`${category.toLowerCase()}`);
              setOptions(response.data.map((entry) => entry.name));  
        }
        // ['Band', 'Orchestra', 'Choir', 'Concert Band', 'Marching Band', 'Chamber Group','Rap Group', 'Duo', 'Trio', 'Quartet', 'Quintet']
        const nonDatabaseOptions = {
            qualifications: ['Self Taught', 'Low Grade(eg ABRSM 1-5)', 'High Grade(eg ABRSM 6-8)','Diploma', "Bachelor's degree", "Master's degree", "Doctorate"],
            musicianship: ['Amateur', 'Full-time music student', 'Semi-Pro', 'Professional', 'Educator' ],
            musicianshipGroup: ['Amateur', 'Semi-Pro', 'Professional', 'School' ],
            'ensemble type':'',
            name:''
        }
        if (category === 'Musicianship' && searchMode === 'groups') {
            setOptions(nonDatabaseOptions['musicianshipGroup'])
        } else if (category.toLowerCase() in nonDatabaseOptions) {
            setOptions(nonDatabaseOptions[category.toLowerCase()]);
        } else {
            getOptionsFromDatabase();
        }
    }, [category]);

    return (
        <div className='flex flex-row w-full items-center'>
            <h1 className='text-xl font-bold w-[6em]'>{category}</h1>
            {options ? 
            <Select
                id= {`input-${category}-select`}
                className='w-[10em] mx-[1em]'
                defaultValue={{ value: category, label: category }}
                size="10"
                options={options?.map((option) => {
                    return { value: option, label: option }
                })}
                value={{ value: filterCriteria[category], label: filterCriteria[category] }}
                onChange={(e) => {
                    setFilterCriteria((prevState) => {
                        return { ...prevState, [category]: e.value }
                    })
                }}
            /> :
            <input
            className = 'w-[10em] mx-[1em]'
            type="text"
            id= {`input-${category}`}
            placeholder = "Enter name"
            value = {inputText}
            onChange={(e)=>{
                setInputText(e.target.value)
                setFilterCriteria((prevState)=>{
                    return { ...prevState, [category]: e.target.value }
                })
            }}>
            </input>
            }
            <button onClick={() => setFilterCriteria((prevState) => {
                const newState = { ...prevState };
                delete newState[category];
                return newState;
            })
            }>
                <XCircleIcon className="h-6 w-6 text-slate-500 cursor-pointer" />
            </button>
        </div>
    )
}