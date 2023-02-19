import firebase from '../firebase';
import { useEffect, useState } from 'react';
import { getDatabase, onValue, ref, remove, set } from 'firebase/database';
import Loading from './Loading';
import {FaTrash, FaPen} from 'react-icons/fa'


const SavedBackronyms = ({activeKey, endpoint}) => {
    const [backronymDb, setBackronymDb] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (!activeKey) return
        setIsLoading(true);
        const database = getDatabase(firebase);
        const dbRef = ref(database, endpoint + activeKey);
        onValue(dbRef, (response) => {
            const newState = [];
            // .val() is a Firebase method that gets us the information we want
            const data = response.val();
            // data is an object, so we iterate through it using a for in loop to access each backronym
            for (let key in data) {
                // inside the loop, we push each item name to an array we already created inside the onValue() function called newState
                newState.push({ key: key, data: data[key] });
            }
            // then, set to state
            setBackronymDb(newState);
            setIsLoading(false);
        });
    }, [activeKey]);    
    const handleTrash = (backronym) => {
        const database = getDatabase(firebase);
        // create a variable that makes a reference to the current liked backronym
        const dbRef = ref(database, endpoint + activeKey +`/${backronym.key}`);
        //remove it from the database
        remove(dbRef);
    };
    const clearData = () => {
        const database = getDatabase(firebase);
        const dbRef = ref(database, endpoint + activeKey);
        set(dbRef, null)
    }

    return (
        <>
            <h2>Collection</h2>

        { isLoading ? <Loading /> : (
             <ul className='savedBackronyms'>
                 {backronymDb.length === 0 ?
                 <p className='addHeader' >Add to Collection </p> 
                 :
                 <>
                    {backronymDb.map((backronym) => {
                        return (
                            <li className='savedBackronym' key={backronym.key}>
                                <p>
                                {backronym.data.map((letter, i) => {
                                    return(<><span key={`${i}${backronym.key}`}>{`${letter.wordData.word} `.slice(0, 1).toUpperCase()}</span>{`${letter.wordData.word} `.slice(1).toLowerCase()}</>)
                                })}
                                </p>
                                <button className='delete' onClick={() => handleTrash(backronym)}><FaTrash /></button>
                                <button className= 'edit' ><FaPen /></button>
                            </li>
                        )
                    })}
                    <button className='clear' onClick={clearData} >Clear</button>
                 </>
                 
                 }
            </ul>
        )}
        </>

    )
};

export default SavedBackronyms;