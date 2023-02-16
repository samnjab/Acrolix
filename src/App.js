
// Modules
import { useState, useEffect } from 'react';
import axios from 'axios';

// Components
import Header from './Components/Header'
import Form from './Components/Form';
import Results from './Components/Results';
import SavedBackronyms from './Components/SavedBackronyms';
import { FaHeart, FaSun, FaMoon } from "react-icons/fa";
import Toggle from './Components/Toggle';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validInput = /^[A-Za-z]{2,6}$/
    if (validInput.test(input)) {
      setValidInput(true);
      setWord(input);
      setInput('');
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
          url: "https://api.datamuse.com/words",
          params: {
            ml: context,
            sp: `${letter}*`
          },
        })
        console.log(wordArray.data)
        return wordArray.data
      }catch(error){
          console.log('hit error', error)
          return [];
      }
        // .then((res) => {
        //   console.log(res.data)
        //   return res.data;
        // }).catch(error => {
        //   console.log('hit error', error)
        //   return [];
        // })
    }
    const getWordsByLetter = async () => {
      const results = await Promise.all(inputLetterArray.map(letter => {
  
        return (fetchWord(letter));
      })
      )
      setResults(results);
      setIsLoading(false);
      console.log(results)
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
        <Header 
        toggleTheme={toggleTheme}
        theme={theme}/>
        {/* <Toggle theme={theme} toggleTheme={toggleTheme} /> */}
        <Form 
        handleSubmit={handleSubmit} 
        setInput={setInput} 
        input={input} 
        context={context} 
        setContext={setContext}/>
        {validInput ? null : <p>bad input dude</p>}
        {isLoading ? <p>Loading...Ï</p> : <Results results={results} />}
        <SavedBackronyms />
      </div>
    </div>
  );
}

export default App;
