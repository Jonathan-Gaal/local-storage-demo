import { useState, useEffect } from "react";

/**
 * Goal is to be able to choose a category,
 * Receive the data from the api the first time,
 * store it in localStorage
 * list out the names or titles
 * if the data has been called before then do not make an api call
 * instead, retrieve the data from localStorage
 *
 */

export default function List() {
  const [category, setCategory] = useState("");
  const [data, setData] = useState([]);

  // this state will be used to teach basics of localStorage. Not needed for app.

  //set state, if there is a local storage object in local storage called myName, or return an empty string
  const [name, setName] = useState(
    JSON.parse(window.localStorage.getItem("myName")) || ""
  );

  useEffect(() => {
    const url = `https://ghibliapi.herokuapp.com/${category}`;
    console.log("useEffect ran");

    //result is the data saved from local storage
    const result = window.localStorage.getItem(category);

    //the the category is 0 length then the manual return will stop the function before the fetch is run, setting the state to an empty array so that when you choose the blank default option you dont have persisting data on the page
    if (category.length === 0) {
      // return;
      return setData([]);
    }
    if (result) {
      // if result data exists in local storage then return the parsed result, otherwise execute a new fetch call which will in turn be stored in local storage
      console.log(`retrieving ${category} data from local storage`);
      setData(JSON.parse(result));
      // setCategory("");
    } else {
      const myName = { first: "Jon", last: "Gaal" };

      window.localStorage.setItem("myName", "JG");
      window.localStorage.setItem("myName", JSON.stringify(myName));

      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          console.log("i ran a fetch for ${category");
          //I want to set local storage using my category and saving the data
          //I want to set my state with the data
          //I want to reset category to prevent infinite loop

          window.localStorage.setItem(category, JSON.stringify(res));
          setData(res);
        });

      setCategory("");
    }
  }, [category]);

  //******* YOUTUBE */

  const [userTextBox, setUserTextBox] = useState("");

  const handleTextChange = (e) => {
    const userInputText = e.target.value;
    setUserTextBox(userInputText);
  };

  const [youTubeData, setYouTubeData] = useState([]);
  console.log("youtube usestate ran");
  useEffect(() => {
    const youTubeURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyCmYuCobDpgNO_Z9j7-nOFiraadZn8JiMY&type=video&q=avicii`;
    fetch(youTubeURL)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        // window.localStorage.setItem(category, JSON.stringify(res));
        setYouTubeData(res);
        console.log(youTubeData);
      });
  }, []);

  return (
    <div className="list">
      <input
        type="text"
        value={userTextBox}
        onChange={handleTextChange}></input>

      <h2>Choose A Category</h2>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value=""></option>
        <option value="people">People</option>
        <option value="locations">Locations</option>
        <option value="films">Films</option>
      </select>
      {data &&
        data.map((item) => <h2 key={item.id}>{item.name || item.title}</h2>)}
      {youTubeData &&
        youTubeData.items.map((vid) => (
          <h2 key={vid.videoId}>{vid.snippet.title || "No result found..."}</h2>
        ))}
    </div>
  );
}
