// Modules
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';

// Components
import Canvas from './Components/Canvas';
import ToggleCanvas from './Components/ToggleCanvas';
import Form from './Components/Form';
import Results from './Components/Results';
import SavedBackronyms from './Components/SavedBackronyms';
import Login from './Components/Login';
import Toggle from './Components/Toggle';
import TypeWriter from './Components/TypeWriter';
import Footer from './Components/Footer';
import Loading from './Components/Loading';
import BadInput from './Components/BadInput';
import Error404 from './Components/Error404';

// style sheets
import './App.scss';

function App() {
  const [begin, setBegin] = useState(false);
  const percentLoad = useRef(0)
  const [displayLoad, setDisplayLoad] = useState(0)
  const [activeKey, setActiveKey] = useState('');
  const [anonKey, setAnonKey] = useState(localStorage.getItem('anonKey') || '');
  const [windowDims, setWindowDims ]= useState([window.innerWidth, window.innerHeight]);
  const [scrollTop, setScrollTop] = useState(0);
  const [canvasOn, setCanvasOn] = useState(true)
  const [endpoint, setEndpoint] = useState('anon/');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [results, setResults] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [validInput, setValidInput] = useState(true);
  const lengthError = useRef(false)
  const letterError = useRef(false)
  const [userKey, setUserKey] = useState('');
  const [stopTyping, setStopTyping] = useState(false)

  window.addEventListener('resize', ( )=> {
    setWindowDims([document.documentElement.clientWidth, document.documentElement.clientHeight])
  })
  useEffect(() => {
    let delta = 200
    const tick = () => {
      percentLoad.current += 1
      delta = 250 - Math.random() * 200
      setDisplayLoad(percentLoad.current)
      if (percentLoad.current > 100) {
        setBegin(true)
        percentLoad.current = 0
        setDisplayLoad(0)
        return
      }else{
        setTimeout(()=> {
          if(!begin) tick()
        }, delta)
      }
    }
    if (!begin){
      tick()
    }
    
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
      lengthError.current = false
      letterError.current = false
      console.log('lengthError in app', lengthError.current, 'letterError in app', letterError.current)
    } else {
      setResults([])
      setValidInput(false);
      if(/[^A-Za-z]/.test(input)){
        letterError.current = true
      }
      else if(/[A-Za-z]{11,}/.test(input) || /[A-Za-z]{1}/.test(input)){
        lengthError.current = true
      }
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
    localStorage.setItem('theme', theme)
    document.body.className = localStorage.getItem('theme');
  }, [theme]);

  return (
    <> {begin ?
      <div className={`App ${theme}`} >
        <div className='layout'>
          {canvasOn ? <Canvas windowDims={windowDims} scrollTop={scrollTop} theme={theme}/> : <></>}
              <Routes>
                <Route path='/' element={
                  <>
                    <div className='wrapper'>
                      <header>
                          <div className='userSettings'>
                            <Login
                              setIsLoggedIn={setIsLoggedIn}
                              isLoggedIn={isLoggedIn}
                              setUserKey={setUserKey}
                            />
                            <Toggle theme={theme} toggleTheme={toggleTheme} />
                            <ToggleCanvas canvasOn={canvasOn} setCanvasOn={setCanvasOn} />
                          </div>
                          <h1 onClick={()=>setStopTyping(false)}>Acrölix</h1>
                          <TypeWriter stopTyping={stopTyping} setStopTyping={setStopTyping}/>
                          <div className='ui'>
                            <Form
                              validInput={validInput}
                              setInput={setInput}
                              input={input}
                              setStopTyping={setStopTyping}
                            />
                            {validInput ? (isLoading ? <Loading /> : <Results results={results} activeKey={activeKey} endpoint={endpoint} />) : (<BadInput letterError={letterError.current} lengthError={lengthError.current}/>)}
                          </div>
                      </header>
                      <SavedBackronyms isLoggedIn={isLoggedIn} activeKey={activeKey} endpoint={endpoint} />
                      <Footer />
                    </div>
                  </>}
                />
                <Route path='*' element={<Error404 />} />
              </Routes>
        </div>
      </div>
      :
      <div className='welcome'>
        <Toggle theme={theme} toggleTheme={toggleTheme} />
        <p >Welcome to Acrölix...</p>
        <p>{displayLoad}%</p>
      </div>
        }
    </>
  )
};

export default App;
