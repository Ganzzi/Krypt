import { useEffect, useState } from "react";

const APIKEY = import.meta.env.VITE_GIPHY_API_KEY;

// function with prop is keyword message
const useFetch = ({ keyword }) => {
  const [gifUrl, setGifUrl] = useState("");

  const fetchGifs = async () => {
    try {
      // get response
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&q=${keyword
          .split(" ")
          .join("")}&limit=1`
      );
      const { data } = await response.json(); //

      setGifUrl(data[0]?.images?.downsized_medium.url); //
      console.log(gifUrl);
    } catch (error) {
      setGifUrl(
        "https://metro.co.uk/wp-content/uploads/2015/05/pokemon_crying.gif?quality=90&strip=all&zoom=1&resize=500%2C284"
      );
    }
  };

  useEffect(() => {
    if (keyword) fetchGifs();
  }, [keyword]);

  return gifUrl; //return a url of image
};

export default useFetch;
