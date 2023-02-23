// Modules
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, useNavigate } from 'react-router-dom';

// Components
import Header from './Components/Header'
import Results from './Components/Results';
import SavedBackronyms from './Components/SavedBackronyms';
import Login from './Components/Login';
import Toggle from './Components/Toggle';
import Footer from './Components/Footer';
import Loading from './Components/Loading';
import BadInput from './Components/BadInput';
import Error404 from './Components/Error404';

// style sheets
import './App.scss';

function App() {
  const [activeKey, setActiveKey] = useState('');
  const [anonKey, setAnonKey] = useState(localStorage.getItem('anonKey') || '');
  const [context, setContext] = useState('');
  const [contextInput, setContextInput] = useState('');
  const [endpoint, setEndpoint] = useState('anon/');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [results, setResults] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [validInput, setValidInput] = useState(true);
  const [userKey, setUserKey] = useState('');
  const [word, setWord] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (anonKey) return
    else{
      const newAnonKey = makeAnonKey(24)
      localStorage.setItem('anonKey', newAnonKey)
      setAnonKey(localStorage.getItem('anonKey'))
    }
  }, [anonKey]);

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
        setActiveKey(userKey);
        setEndpoint('users/');
    }else {
      setActiveKey(anonKey);
      setEndpoint('anon/');
    }
  }, [userKey, anonKey])

  const handleSubmit = (e) => {
    e.preventDefault();
    const validInput = /^[A-Za-z]{2,6}$/
    if (validInput.test(input)) {
      setValidInput(true);
      setWord(input);
      setContext(contextInput);
      setInput('');
      setContextInput('');
      navigate('/backronym');
    } else {
      setResults([])
      setWord('');
      setContext('');
      setValidInput(false);
    }
  }

  useEffect(() => {
    if (word.length === 0) return;
    setIsLoading(true);
    const inputLetterArray = [...word];
    const fetchWord = async (letter) => {
      try {
        const wordArray = await
          axios({
            url: 'https://api.datamuse.com/words',
            params: {
              ml: context,
              sp: `${letter}*`
            },
          })
        return wordArray.data
      } catch (error) {
        return [];
      }
    }
    const getWordsByLetter = async () => {
      const results = await Promise.all(inputLetterArray.map(letter => {

        return (fetchWord(letter));
      })
      )
      if (results[0].length === 0) {
        setIsLoading(false);
        setValidInput(false);
      } else {
        setResults(results);
        setIsLoading(false);
      }
    }
    getWordsByLetter();

  }, [word, context]);

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
        <div className='userSettings'>
          <Login
            setIsLoggedIn={setIsLoggedIn}
            isLoggedIn={isLoggedIn}
            setUserKey={setUserKey}
          />
          <Toggle theme={theme} toggleTheme={toggleTheme} />
        </div>
        <Header
          toggleTheme={toggleTheme}
          theme={theme}
          validInput={validInput}
          handleSubmit={handleSubmit}
          setInput={setInput}
          input={input}
          contextInput={contextInput}
          setContextInput={setContextInput}
        />
        <Routes>
          <Route path='/' element={
            <>
              {validInput ? (isLoading ? <Loading /> : <Results results={results} activeKey={activeKey} endpoint={endpoint} />) : (<BadInput />)}
              <SavedBackronyms isLoggedIn={isLoggedIn} activeKey={activeKey} endpoint={endpoint} />
            </>}
          />
          <Route path='backronym' element={
            <>
              {validInput ? (isLoading ? <Loading /> : <Results results={results} activeKey={activeKey} endpoint={endpoint} />) : (<BadInput />)}
              <SavedBackronyms isLoggedIn={isLoggedIn} activeKey={activeKey} endpoint={endpoint} />
            </>}
          />
          <Route path='*' element={<Error404 />} />
        </Routes>
        <Footer />
      </div>
    </div>
  )
};

export default App;
