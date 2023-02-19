import axios from 'axios';
import firebase from '../firebase';
import { useEffect, useState } from 'react';
import { getDatabase, onValue, ref, remove, set } from 'firebase/database';
import Loading from './Loading';
import {FaTrash, FaPen, FaSave} from 'react-icons/fa'


const SavedBackronyms = ({activeKey, endpoint}) => {
    const [backronymDb, setBackronymDb] = useState([]);
    const [newBackronymDb, setNewBackronymDb] = useState([])
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
                newState.push({ key: key, data: data[key], editOn:false });
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
    const randomItem = (array) => {
        const randomNumber = Math.floor(Math.random() * array.length);
        return array[randomNumber];
    }
    const fetchWord = async (letter) => {
      try{
        const wordArray = await
        axios({
          url: 'https://api.datamuse.com/words',
          params: {
            // ml: context,
            sp: `${letter}*`
          },
        })
        return wordArray.data
      }catch(error){
          return [];
      }
    }
    const handleEdit = (backronym, i) => {
        setBackronymDb([...backronymDb.slice(0, i), {key:backronym.key, data:backronym.data, editOn:!(backronym.editOn)}, ...backronymDb.slice(i + 1, backronymDb.length)])
        setNewBackronymDb([...backronymDb])
    }
    const handleRefresh = (backronym, i) => {
        // const database = getDatabase(firebase)
        // const dbRef = ref(database, endpoint + activeKey +`/${backronym.key}`)
        const inputLetterArray = backronym.data.map(wordObj => {
            return wordObj.wordData.word.slice(0, 1)
        })
        console.log(inputLetterArray)
        const getWordsByLetter = async () => {
            const results = await Promise.all(inputLetterArray.map(letter => {
                return (fetchWord(letter));
            })
            )
            console.log('results are', results)
            const newBackromym = results.map((wordArray, i) => {
                if (backronym.data[i].locked) return backronym.data[i]
                return {key: backronym.key, data:randomItem(wordArray), editOn:backronym.editOn}
            })
            console.log('new backronym', newBackromym)
            setNewBackronymDb([...newBackronymDb.slice(0, i), newBackromym, ...newBackronymDb.slice(i + 1, backronymDb.length)])
        }
        getWordsByLetter();        

    }
    const handleSave = () => {

    }

    return (
        <>
            <h2>Collection</h2>

        { isLoading ? <Loading /> : (
             <ul className='savedBackronyms'>
                 {backronymDb.length === 0 ?
                 <p className='addHeader' >+ Add to Collection </p> 
                 :
                 <>
                 {console.log('backronymDb is',backronymDb)}
                    {backronymDb.map((backronym, i) => {
                        return (
                            <li className='savedBackronym' key={backronym.key}>
                                <p>
                                {backronym.editOn ? 
                                newBackronymDb[i].data.map((letter, i) => {
                                    return(<><span key={`${i}${backronym.key}`}>{`${letter.wordData.word} `.slice(0, 1).toUpperCase()}</span>{`${letter.wordData.word} `.slice(1).toLowerCase()}</>)
                                })
                                :
                                backronym.data.map((letter, i) => {
                                    return(<><span key={`${i}${backronym.key}`}>{`${letter.wordData.word} `.slice(0, 1).toUpperCase()}</span>{`${letter.wordData.word} `.slice(1).toLowerCase()}</>)
                                })}
                                </p>
                                <button className= 'edit' onClick={()=> handleEdit(backronym, i)}><FaPen /></button>
                                {backronym.editOn ? 
                                <>
                                    <button className='refresh' onClick={()=> handleRefresh(backronym, i)}><i className="fa-solid fa-arrows-rotate"></i></button> 
                                    <button className='save'><i className="fa-solid fa-cloud-arrow-up"></i></button>
                                    <button className='cancel'><i className="fa-solid fa-xmark"></i></button>
                                </>
                                :
                                <button className='delete' onClick={() => handleTrash(backronym)}><FaTrash /></button>
                                }
                                
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