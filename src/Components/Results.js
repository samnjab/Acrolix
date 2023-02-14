import firebase from '../firebase'; 
import { useEffect, useState } from 'react';
import {getDatabase, onValue, ref, push} from 'firebase/database'; 

const Results = ({results}) => { 
    const [liked, setLiked] = useState(false);
    const randomItem = (array) => {
        const randomNumber = Math.floor(Math.random() * array.length)
        return array[randomNumber];
    }
    
    const resultsToDisplay = results.map( (letter) => {
        const letterArray = [];
        for(let i = 0; i < 1; i++){
            letterArray.push(randomItem(letter));
        }
        return letterArray;
        // *** NEED TO FIX - GIVES ERROR FOR SAME KEY BEING USED TWICE ***
    })
    console.log(resultsToDisplay); 
    

    const [backronym, setBackronym] = useState([]);
    useEffect(() => {
    // create a variable that holds our database details
    const database = getDatabase(firebase)
    // create a variable that makes a reference to our datbase
    const dbRef = ref(database)
    
    onValue(dbRef, (response) => {
      // here we use Firebase's .val() method to parse our database info the way we want it
      // here we're creating a variable to store the new state we want to introduce to our app
      const newState = [];

      // here we store the response from our query to Firebase inside of a variable called data.
      // .val() is a Firebase method that gets us the information we want
      const data = response.val();
      // data is an object, so we iterate through it using a for in loop to access each book name 
        /* console.log(data); */
      for (let key in data) {
        // inside the loop, we push each item name to an array we already created inside the onValue() function called newState
        newState.push(data[key]);
      }

      // then, we call setItems in order to update our component's state using the local array newState
      setBackronym(newState);   
      console.log(backronym);
    });
  }, [liked])

   
    const handleLike = () => { 
        setLiked(true);
    }
    
    const handleUnlike = () => {
        setLiked(false);
    }
    return (
        <>
        {resultsToDisplay.map( (letter, index) => {
            return <ul key={index}>
                {letter.map( (word) => {
                    return <li key={word.score}>
                        {word.word}
                    </li>
                })}
            </ul>
        })}
       <button >{ liked ? <i class="fa-solid fa-heart" onClick={handleUnlike}></i> : <i class="fa-regular fa-heart" onClick={handleLike}></i> }</button> 
       <button>random</button>
        </>
    )
}

export default Results;

// End result: we want an array of arrays
    // each array contains 1 word
    // for each index we get a random word
        // push that random word to resultsToDisplay array
            // map through resultsToDisplay array
                // each index will return an unordered list of words

