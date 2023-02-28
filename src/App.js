// Modules
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

// Components
import Canvas from './Components/Canvas';
import Form from './Components/Form';
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
  // const [context, setContext] = useState('');
  // const [contextInput, setContextInput] = useState('');
  const [windowDims, setWindowDims ]= useState([window.innerWidth, window.innerHeight])
  const [scrollTop, setScrollTop] = useState(0)
  const [endpoint, setEndpoint] = useState('anon/');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [results, setResults] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [validInput, setValidInput] = useState(true);
  const [userKey, setUserKey] = useState('');


  const navigate = useNavigate();
  window.addEventListener('resize', ( )=> {
    setWindowDims([window.innerWidth, window.innerHeight])
  })
  useEffect(() => {
    const handleScroll = () => {
      setScrollTop(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }

  }, [])

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

  const checkValid = () => {
    const validInput = /^[A-Za-z]{2,10}$/
    if (validInput.test(input)) {
      setValidInput(true);
      navigate('/backronym');
    } else {
      setResults([])
      setValidInput(false);
    }
  }

  useEffect(() => {
    if (input.length === 0) return;
    const fetchWord = async (letter) => {
      try {
        const wordArray = await
          axios({
            url: 'https://api.datamuse.com/words',
            params: {
              // ml: context,
              sp: `${letter}*`
            },
          })
          if (wordArray.length === 0) {
            setIsLoading(false);
            setValidInput(false);
          }
        return wordArray.data
      } catch (error) {
        return [];
      }
    }
    const getWordsByLetter = async (inputLetterArray) => {
      const results = await Promise.all(inputLetterArray.map(letter => {
        return (fetchWord(letter));
      })
      )
      setResults(results);
      setIsLoading(false);
    }
    checkValid();
    if (validInput) {
      const inputLetterArray = [...input];
      setIsLoading(true);
      getWordsByLetter(inputLetterArray);
    }
  }, [input]);

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
    <div className={`App ${theme}`} >
      <div className='layout'>
        <Canvas windowDims={windowDims} scrollTop={scrollTop}/>
          <div className='wrapper'>
            <header>
                <div className='userSettings'>
                  <Login
                    setIsLoggedIn={setIsLoggedIn}
                    isLoggedIn={isLoggedIn}
                    setUserKey={setUserKey}
                  />
                  <Toggle theme={theme} toggleTheme={toggleTheme} />
                </div>
                <Link to='/'>
                    <h1>Acrolix</h1>
                </Link>
                <Form
                  validInput={validInput}
                  setInput={setInput}
                  input={input}
                />
            </header>
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
    </div>
  )
};

export default App;
