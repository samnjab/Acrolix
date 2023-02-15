import firebase from '../firebase';
import { useEffect, useState } from 'react';
import { getDatabase, onValue, ref, remove } from 'firebase/database';
import Loading from './Loading';

const SavedBackronyms = () => {
    const [backronymDb, setBackronymDb] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const database = getDatabase(firebase);
        const dbRef = ref(database);
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
    }, []);

    const handleTrash = (backronym) => {
        const database = getDatabase(firebase);
        // create a variable that makes a reference to the current liked backronym
        const dbRef = ref(database, `/${backronym.key}`);
        //remove it from the database
        remove(dbRef);
    };

    return (
        <>
        { isLoading ? <Loading /> : (
                    <ul>
                    {backronymDb.map((backronym) => {
                        return (
                            <li key={backronym.key}>
                                {backronym.data.map((letter) => {
                                    return(`${letter[0].word} `)
                                })}
                                <button onClick={() => handleTrash(backronym)}>trash</button>
                            </li>
                        )
                    })}
                </ul>
        ) }
        </>
    )
};

export default SavedBackronyms;