
// Modules
import { useState, useEffect } from 'react'
import axios from 'axios'
// Components
import Form from './Components/Form'

// style sheets
import './App.scss';
import Results from './Components/Results';

function App() {
  const [word, setWord] = useState('')
  const [input, setInput] = useState('')
  const [results, setResults] = useState([])

  const handleSubmit = (e)=>{
    e.preventDefault()
    setWord(input)
    setInput('');
  }
  
  useEffect(()=>{
    if (word.length === 0 ) return
    console.log([...word])
    const inputLetterArray = [...word]
    const fetchWord = async(letter) => {
      const wordArray = await 
      axios({
      url: "https://api.datamuse.com/words",
      // method: "GET",
      // dataResponse: "json",
      params: {
        // ml:'apple',
        sp:`${letter}*`
      },
      }).then((res) => {
        return res.data
  
      }).catch(error=>{
        return []
      })
      return wordArray
    }
    const getWordsByLetter = async() => {
      const results = await Promise.all(inputLetterArray.map(letter => {
        return (fetchWord(letter))
      })
      ) 
      setResults(results)
      console.log(results)
    }
    getWordsByLetter();

  },[word])


  return (
    <div className='App'>
      <div className='wrapper'>
        <h1>Backronyms</h1>
        <Form handleSubmit={handleSubmit} setInput={setInput} input={input} />
        <Results results={results}/>
      </div>
    </div>
  );
}

export default App;
