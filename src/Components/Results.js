import firebase from '../firebase';
import { useEffect, useState } from 'react';
import { getDatabase, onValue, ref, push, remove } from 'firebase/database';

const Results = ({ results }) => {
    const [liked, setLiked] = useState(false);
    const [backronymDb, setBackronymDb] = useState([]);
    const [backronymToDisplay, setBackronymToDisplay] = useState([]);
    const [randomize, setRandomize] = useState(false);
    const [savedBackronyms, setSavedBackronyms] = useState([]);
    const [currentBackronymKey, setCurrentBackronymKey] = useState("");


    useEffect(() => {
        // create a variable that holds our database details
        const database = getDatabase(firebase);
        // create a variable that makes a reference to our database
        const dbRef = ref(database);

        onValue(dbRef, (response) => {
            // here we use Firebase's .val() method to parse our database info the way we want it
            // here we're creating a variable to store the new state we want to introduce to our app
            const newState = [];

            // here we store the response from our query to Firebase inside of a variable called data.
            // .val() is a Firebase method that gets us the information we want
            const data = response.val();
            // data is an object, so we iterate through it using a for in loop to access each book name 
            for (let key in data) {
                // inside the loop, we push each item name to an array we already created inside the onValue() function called newState
                newState.push({ key: key, data: data[key] });
            }

            // then, we call setItems in order to update our component's state using the local array newState
            setBackronymDb(newState);
        });
    }, [liked]);

    useEffect(() => {
        const backronymResult = results.map((letterArr) => {
            const backronymArray = [];
            for (let i = 0; i < 1; i++) {
                backronymArray.push(randomItem(letterArr));
            }
            return backronymArray;
        })
        setBackronymToDisplay(backronymResult);
    }, [randomize, results]);

    const randomItem = (array) => {
        setLiked(false);
        const randomNumber = Math.floor(Math.random() * array.length);
        return array[randomNumber];
    }

    const handleLike = () => {
        setLiked(true);
        // create a variable that holds our database details
        const database = getDatabase(firebase);
        // create a variable that makes a reference to our database
        const dbRef = ref(database);

        //push backronym to database
        const dbKey = push(dbRef, backronymToDisplay);

        //save key from current backronym to state
        setCurrentBackronymKey(dbKey.key);
    }

    const handleUnlike = () => {
        setLiked(false);
        // create a variable that holds our database details
        const database = getDatabase(firebase);
        // create a variable that makes a reference to the current liked backronym
        const dbRef = ref(database, `/${currentBackronymKey}`);
        //remove it from the database
        remove(dbRef);
        setCurrentBackronymKey("");
    }

    const handleRandom = () => {
        setRandomize(!randomize);
    };

    return (
        <ul>
            {backronymToDisplay.map((index, i) => {
                return <li key={`${index[0].score}${i}`}>{index[0].word}</li>
            })}
            <button >
                {liked ?
                <i className="fa-solid fa-heart" onClick={handleUnlike}></i>
                : <i className="fa-regular fa-heart" onClick={handleLike}></i>}
            </button>
            <button onClick={handleRandom}>random</button>
        </ul>
    );
}

export default Results;

// End result: we want an array of arrays
    // each array contains 1 word
    // for each index we get a random word
        // push that random word to resultsToDisplay array
            // map through resultsToDisplay array
                // each index will return an unordered list of words

