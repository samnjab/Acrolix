
// Modules
import { useState, useEffect } from 'react';
import axios from 'axios';

// Components
import Form from './Components/Form';
import Results from './Components/Results';
import SavedBackronyms from './Components/SavedBackronyms';

// style sheets
import './App.scss';

function App() {
  const [theme, setTheme] = useState('light');
  const [word, setWord] = useState('');
  const [input, setInput] = useState('');
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
    } else {
      setResults([])
      setValidInput(false);
    }
  }

  useEffect(() => {
    if (word.length === 0) return;
    setIsLoading(true);
    const inputLetterArray = [...word];
    const fetchWord = async (letter) => {
      const wordArray = await
        axios({
          url: "https://api.datamuse.com/words",
          params: {
            ml: word,
            sp: `${letter}*`
          },
        }).then((res) => {
          return res.data;

        }).catch(error => {
          return [];
        })
      return wordArray;
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
        <h1>Backronyms</h1>
        <button onClick={toggleTheme}>toggle mode</button>
        <Form handleSubmit={handleSubmit} setInput={setInput} input={input} />
        {validInput ? null : <p>bad input dude</p>}
        {isLoading ? <p>Loading...Ï</p> : <Results results={results} />}
        <SavedBackronyms />
      </div>
    </div>
  );
}

export default App;
