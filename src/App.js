// Modules
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { getDatabase, ref, push, remove, set } from 'firebase/database';

// Components
import firebase from './firebase';
import Header from './Components/Header'
import Form from './Components/Form';
import Results from './Components/Results';
import SavedBackronyms from './Components/SavedBackronyms';
import Login from './Components/Login';

import Loading from './Components/Loading';
import BadInput from './Components/BadInput';
import Error404 from './Components/Error404';

// style sheets
import './App.scss';

function App() {
  const [theme, setTheme] = useState('dark');
  const [word, setWord] = useState('');
  const [input, setInput] = useState('');
  const [context, setContext] = useState('')
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [validInput, setValidInput] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anonKey, setAnonKey] = useState(localStorage.getItem('anonKey') || '');
  const [userKey, setUserKey] = useState('');
  const [activeKey, setActiveKey] = useState('')
  const [endpoint, setEndpoint] = useState('anon/') 

  useEffect(() => {
    console.log('anon key is', anonKey)
    if (anonKey) return
    else{
      const newAnonKey = makeAnonKey(24)
      localStorage.setItem('anonKey', newAnonKey)
      console.log('set local storage to', newAnonKey)
      setAnonKey(localStorage.getItem('anonKey'))
    }
   
  },[])
  const makeAnonKey = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i ++){
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
  useEffect(()=>{
    if (userKey){
        setActiveKey(userKey)
        setEndpoint('users/')
    }else{
      setActiveKey(anonKey)
      setEndpoint('anon/')
    }
  },[userKey, anonKey])

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const validInput = /^[A-Za-z]{2,6}$/
    if (validInput.test(input)) {
      setValidInput(true);
      setWord(input);
      setInput('');
      navigate('/backronym');
      setContext('')
    } else {
      setResults([])
      setWord('');
      setValidInput(false);
    }
  }

  useEffect(() => {
    if (word.length === 0) return;
    setIsLoading(true);
    const inputLetterArray = [...word];
    const fetchWord = async (letter) => {
      try{
        const wordArray = await
        axios({
          url: 'https://api.datamuse.com/words',
          params: {
            ml: context,
            sp: `${letter}*`
          },
        })
        return wordArray.data
      }catch(error){
          return [];
      }
    }
    const getWordsByLetter = async () => {
      const results = await Promise.all(inputLetterArray.map(letter => {
  
        return (fetchWord(letter));
      })
      )
      setResults(results);
      setIsLoading(false);
    }
    getWordsByLetter();

  }, [word]);

  // LIGHT/DARK FUNCTION
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className={`App ${theme}`}>
      <div className='wrapper'>
        <Link to="/">
         <Header 
        toggleTheme={toggleTheme}
        theme={theme}/>
        <Login
        setIsLoggedIn={setIsLoggedIn}
        isLoggedIn={isLoggedIn}
        setUserKey={setUserKey}
        userKey={userKey}
        />
        </Link>
        <Routes>
          <Route path='/' element= {
            <>
              <Form 
                validInput={validInput}
                handleSubmit={handleSubmit} 
                setInput={setInput} 
                input={input} 
                context={context} 
                setContext={setContext}/>
              {validInput ? null : <BadInput />}
              <button onClick={()=> localStorage.clear()}>Clear Cache</button>
              <SavedBackronyms isLoggedIn={isLoggedIn} activeKey={activeKey} endpoint={endpoint} /> 
            </>
          } />

          <Route path='backronym' element= {
            <>
              <Form 
                handleSubmit={handleSubmit} 
                setInput={setInput} 
                input={input} 
                context={context} 
                setContext={setContext}/>
              {validInput ? (isLoading ? <Loading /> : <Results results={results} activeKey={activeKey} endpoint={endpoint}/>) : (<BadInput />)}
              <SavedBackronyms isLoggedIn={isLoggedIn} activeKey={activeKey} endpoint={endpoint} /> 
            </>
          } />
          <Route path='*' element={<Error404 />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
