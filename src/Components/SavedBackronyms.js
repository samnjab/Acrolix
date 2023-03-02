import axios from 'axios';
import firebase from '../firebase';
import { useEffect, useState, useRef } from 'react';
import { getDatabase, onValue, ref, remove, set } from 'firebase/database';
import Loading from './Loading';

const SavedBackronyms = ({ activeKey, endpoint }) => {
    const [backronymDb, setBackronymDb] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newBackronymDb, setNewBackronymDb] = useState([]);
    const [results, setResults] = useState({backronym:{}, index:null, apiResults:[]})
    const [randomize, setRandomize] = useState(false)

    useEffect(() => {
        if (!activeKey) return
        setIsLoading(true);
        const database = getDatabase(firebase);
        const dbRef = ref(database, endpoint + activeKey);
        onValue(dbRef, (response) => {
            const newState = [];
            const data = response.val();
            for (let key in data) {
                // inside the loop, we push each item name to an array we already created inside the onValue() function called newState
                newState.push({ key: key, data: data[key], editOn: false });
            }
            setBackronymDb(newState);
            setIsLoading(false);
        });
    }, [activeKey]);

    const handleTrash = (backronym) => {
        const database = getDatabase(firebase);
        // create a variable that makes a reference to the current liked backronym
        const dbRef = ref(database, endpoint + activeKey + `/${backronym.key}`);
        //remove it from the database
        remove(dbRef);
    };

    const clearData = () => {
        const database = getDatabase(firebase);
        const dbRef = ref(database, endpoint + activeKey);
        set(dbRef, null);
    }

    const randomItem = (array) => {
        const randomNumber = Math.floor(Math.random() * array.length);
        return array[randomNumber];
    }

    const fetchWord = async (letter) => {
        try {
            const wordArray = await
                axios({
                    url: 'https://api.datamuse.com/words',
                    params: {
                        sp: `${letter}*`
                    },
                })
            return wordArray.data;
        } catch (error) {
            return [];
        }
    };

    const handleEdit = (backronym, i) => {
        setBackronymDb([...backronymDb.slice(0, i), { key: backronym.key, data: backronym.data, editOn: !(backronym.editOn) }, ...backronymDb.slice(i + 1, backronymDb.length)]);
        setResults({backronym:backronym, index:i, apiResults:[]})
        setNewBackronymDb([...backronymDb]);
    }

    const handleRefresh = (backronym, i) => {
        const inputLetterArray = backronym.data.map(wordObj => {
            return wordObj.wordData.word.slice(0, 1)
        })
        const getWordsByLetter = async () => {
            let apiResults = await Promise.all(inputLetterArray.map(letter => {
                return (fetchWord(letter));
            })
            )
            setResults({backronym:results.backronym, index:results.index, apiResults:apiResults})
        }
        if(results.apiResults.length === 0) {
            console.log('api results empy')
            getWordsByLetter();
           
        }
        else{
            setRandomize(!randomize)
        }
        
    };
    useEffect(() => {
        let newBackromymData = results.apiResults.map((wordArray, i) => {
        if (results.backronym.data[i].locked) return results.backronym.data[results.index]
            return { wordData: randomItem(wordArray), locked: false }
        })
        setNewBackronymDb([...newBackronymDb.slice(0, results.index), { key: results.backronym.key, data: newBackromymData, editOn: results.backronym.editOn }, ...newBackronymDb.slice(results.index + 1, newBackronymDb.length)]);
    },[results.apiResults, randomize])

    const handleSave = (backronym) => {
        const database = getDatabase(firebase);
        set(ref(database, endpoint + activeKey + `/${backronym.key}`), backronym.data);
        setResults({backronym:{}, index:null, apiResults:[]})
    };
    const handleLock = (j) => {
        console.log('j is', j, 'newBackronymDb at j is',newBackronymDb[j])
        setNewBackronymDb([...newBackronymDb.slice(0, j), {wordData: newBackronymDb[j].wordData, locked:true }, ...newBackronymDb.slice(j + 1, newBackronymDb.length)])
    };

    const handleUnlock = (j) => {
        setNewBackronymDb([...newBackronymDb.slice(0, j), {wordData: newBackronymDb[j].wordData, locked:false }, ...newBackronymDb.slice(j + 1, newBackronymDb.length)])
    };
    
    return (
        <>
            {isLoading ? <Loading /> : (
                <div className='savedBackronyms'>
                    <h2>Collection</h2>
                    <ul className='savedBackronymList'>
                        {backronymDb.length === 0 ?
                            <p className='addHeader' >+ Add to Collection </p>
                            :
                            <>
                                {backronymDb.map((backronym, i) => {
                                    return (
                                        <li className='savedBackronym' key={backronym.key}>
                                            {backronym.editOn ?
                                                <>
                                                    <div className='edit'>
                                                        {newBackronymDb[i].data.map((wordObj, j) => {
                                                            {console.log('word obj is', wordObj)}
                                                            return (
                                                            <>
                                                                <p className='word'>
                                                                    <span key={`${j}${backronym.key}`}>{`${wordObj.wordData.word} `.slice(0, 1).toUpperCase()}</span>{`${wordObj.wordData.word} `.slice(1).toLowerCase()}
                                                                </p>
                                                                {wordObj.locked ? 
                                                                <i className='fa-solid fa-lock editLock editLocked' onClick={() => handleUnlock(j)}></i>
                                                                : 
                                                                <i className='fa-solid fa-unlock editLock editUnlocked' onClick={() => handleLock(j)}></i>}
                                                            </>
                                                            )
                                                        })}
                                                    </div>
                                                    <div className="buttonContainer">
                                                        <button className='refresh' onClick={() => handleRefresh(backronym, i)}><i className="fa-solid fa-arrows-rotate"></i></button>
                                                        <button className='save' onClick={() => handleSave(newBackronymDb[i])}><i className="fa-solid fa-cloud-arrow-up"></i></button>
                                                        <button className='cancel' onClick={() => handleEdit(backronym, i)}><i className="fa-solid fa-xmark"></i></button>
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <p className='nonEdit'>
                                                        {backronym.data.map((letter, j) => {
                                                            return (<><span key={`${j}${backronym.key}`}>{`${letter.wordData.word} `.slice(0, 1).toUpperCase()}</span>{`${letter.wordData.word} `.slice(1).toLowerCase()}</>)
                                                        })}
                                                    </p>
                                                    <div className="buttonContainer">
                                                        <button className='delete' onClick={() => handleTrash(backronym)}><i className='fa-solid fa-trash'></i></button>
                                                        <button className='edit' onClick={() => handleEdit(backronym, i)}><i className='fa-solid fa-pen'></i></button>
                                                    </div>
                                                </>
                                            }
                                        </li>
                                    )
                                })}
                            </>
                        }
                    </ul>
                    <button className='clear' onClick={clearData}>Clear All</button>
                </div>
            )}
        </>
    )
};

export default SavedBackronyms;