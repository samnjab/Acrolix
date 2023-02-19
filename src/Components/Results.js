import firebase from '../firebase';
import { useEffect, useState } from 'react';
import { getDatabase, ref, push, remove } from 'firebase/database';
import { FaLock, FaUnlock } from 'react-icons/fa'
const Results = ({ results, activeKey, endpoint}) => {
    const [liked, setLiked] = useState(false);
    const [backronymToDisplay, setBackronymToDisplay] = useState([]);
    const [randomize, setRandomize] = useState(false);
    const [currentBackronymKey, setCurrentBackronymKey] = useState("");
    
    useEffect(() => {
        const backronymResult = results.map((letterArr) => {
            return { wordData:randomItem(letterArr), locked: false }
        })
        setBackronymToDisplay(backronymResult);
    }, [results]);

    useEffect(()=> {
        if (backronymToDisplay.length === 0) return
        setBackronymToDisplay(backronymToDisplay.map((wordObj, i) => {
            if (wordObj.locked) return wordObj
            else return {wordData:randomItem(results[i]), locked:false}
        }))
    }, [randomize])

    const randomItem = (array) => {
        setLiked(false);
        const randomNumber = Math.floor(Math.random() * array.length);
        return array[randomNumber];
    }
    const handleLike = () => { 
        setLiked(true);
        const database = getDatabase(firebase)
        //push backronym to database
        //save key from current backronym to state
        const dbBackronym = push(ref(database, endpoint + activeKey), backronymToDisplay)
        //setCurrentBackronymKey(dbKey.key);
        setCurrentBackronymKey(dbBackronym.key);
    }
      
    const handleUnlike = () => {
        setLiked(false);
        // create a variable that holds our database details
        const database = getDatabase(firebase);
        // create a variable that makes a reference to the current liked backronym
        const dbRef = ref(database, endpoint + activeKey +`/${currentBackronymKey}`);
        //remove it from the database
        remove(dbRef);
        setCurrentBackronymKey("");
    }
    const handleRandom = () => {
        setRandomize(!randomize);
    };
    const handleLock = (i) => {
        setBackronymToDisplay([...backronymToDisplay.slice(0, i), {wordData: backronymToDisplay[i].wordData, locked:true }, ...backronymToDisplay.slice(i + 1, backronymToDisplay.length)])
    }
    const handleUnlock = (i) => {
         setBackronymToDisplay([...backronymToDisplay.slice(0, i), {wordData: backronymToDisplay[i].wordData, locked:false }, ...backronymToDisplay.slice(i + 1, backronymToDisplay.length)])
    }
    return (
        <>
            {backronymToDisplay.length === 0 ? 
            <></> :
            <section className="activeResult">
                <ul className="activeBackronym">
                    
                    { backronymToDisplay.map((wordObj, i) => {
                        return <li key={`${wordObj.wordData?.score}${i}`}>
                            {wordObj.wordData?.word}
                            {wordObj.locked ? 
                            <FaLock className='lock locked' onClick={() => handleUnlock(i)}/> 
                            : 
                            <FaUnlock className='lock' onClick={() => handleLock(i)}/>}
                            </li>
                    })}
                </ul>
                <div className="buttons">
                    <button >
                        {liked ?
                            <i className="fa-solid fa-heart" onClick={handleUnlike}></i>
                            : <i className="fa-regular fa-heart" onClick={handleLike}></i>}
                    </button>
                    <button onClick={handleRandom}><i className="fa-solid fa-arrows-rotate"></i></button>
                </div>
            
            
            </section>
            }
        </>
    );
}
export default Results;