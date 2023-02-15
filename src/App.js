
// Modules
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, useNavigate, Link } from "react-router-dom";

// Components
import Form from './Components/Form';
import Results from './Components/Results';
import SavedBackronyms from './Components/SavedBackronyms';
import Loading from './Components/Loading';
import BadInput from './Components/BadInput';
import Error404 from './Components/Error404';

// style sheets
import './App.scss';

function App() {
  const [theme, setTheme] = useState('light');
  const [word, setWord] = useState('');
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [validInput, setValidInput] = useState(true);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const validInput = /^[A-Za-z]{2,6}$/
    if (validInput.test(input)) {
      setValidInput(true);
      setWord(input);
      setInput('');
      navigate('/backronym');
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
      // setIsLoading(false);
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
          <h1>Back To The Acronym</h1>
        </Link>
        <button onClick={toggleTheme}><i className="fa-solid fa-circle-half-stroke"></i></button>
        <Routes>
          <Route path='/' element={
            <>
              <Form handleSubmit={handleSubmit} setInput={setInput} input={input} />
              {validInput ? null : <BadInput />}
              <SavedBackronyms />
            </>
          } />

          <Route path='backronym' element={
            <>
              <Form handleSubmit={handleSubmit} setInput={setInput} input={input} />
              {validInput ? (isLoading ? <Loading /> : <Results results={results} />) : (<BadInput />)}
              <SavedBackronyms />
            </>
          } />

          <Route path='*' element={<Error404 />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
