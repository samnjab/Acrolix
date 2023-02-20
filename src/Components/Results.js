import firebase from '../firebase';
import { useEffect, useState } from 'react';
import { getDatabase, ref, push, remove } from 'firebase/database';

const Results = ({ results, activeKey, endpoint}) => {
    const [backronymToDisplay, setBackronymToDisplay] = useState([]);
    const [currentBackronymKey, setCurrentBackronymKey] = useState('');
    const [liked, setLiked] = useState(false);
    const [randomize, setRandomize] = useState(false);
    
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
        
    }, [randomize]);

    const randomItem = (array) => {
        setLiked(false);
        const randomNumber = Math.floor(Math.random() * array.length);
        return array[randomNumber];
    };
    
    const handleLike = () => { 
        setLiked(true);
        const database = getDatabase(firebase)
        const savedBackronym = backronymToDisplay.map(wordObj => {
            return {wordData: wordObj.wordData, locked: false}
        })
        const dbBackronym = push(ref(database, endpoint + activeKey), savedBackronym)
        setCurrentBackronymKey(dbBackronym.key);
    };

    const handleUnlike = () => {
        setLiked(false);
        const database = getDatabase(firebase);
        const dbRef = ref(database, endpoint + activeKey +`/${currentBackronymKey}`);
        remove(dbRef);
        setCurrentBackronymKey('');
    };

    const handleRandom = () => {
        setRandomize(!randomize);
    };

    const handleLock = (i) => {
        setBackronymToDisplay([...backronymToDisplay.slice(0, i), {wordData: backronymToDisplay[i].wordData, locked:true }, ...backronymToDisplay.slice(i + 1, backronymToDisplay.length)])
    };

    const handleUnlock = (i) => {
        setBackronymToDisplay([...backronymToDisplay.slice(0, i), {wordData: backronymToDisplay[i].wordData, locked:false }, ...backronymToDisplay.slice(i + 1, backronymToDisplay.length)])
    };
    
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
                            <i className='fa-solid fa-lock lock locked' onClick={() => handleUnlock(i)}></i>
                            : 
                            <i className='fa-solid fa-unlock lock' onClick={() => handleLock(i)}></i>}
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
};

export default Results;