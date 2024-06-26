import React, { useEffect, useState } from "react";
import apiRequest from "../../../api";

export function GenreList({ displayedUserId }) {
  const [genresList, setGenresList] = useState([]);

  useEffect(() => {
    const getGenreInfo = async () => {
      const genreInfo = await apiRequest.get(
        `users/${displayedUserId}/genres`,
      );
      setGenresList(genreInfo.data.genreInterests.map((genre) => genre.name)); // check what's in genreInfo
    };
    getGenreInfo();
  }, [displayedUserId]);

  

  const genreText = genresList.map((genre, index) => {
    return (
      <div key={index} id={genre}>
        {genre.toUpperCase() + (index !== genresList.length - 1 ? ' / ' : '')}
        &nbsp;
      </div>
    );
  });

  

  return (
      <div className="text-xl font-semibold leading-[1.2em] pr-[1em] flex flex-row justify-center">
        {genreText}
      </div>
  );
}
