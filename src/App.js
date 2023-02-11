
// Modules
import { useState, useEffect } from 'react'
import axios from 'axios'
// Components
import Form from './Components/Form'

// style sheets
import './App.scss';

function App() {
  const [word, setWord] = useState('')
  const [input, setInput] = useState('')

  const handleSubmit = (e)=>{
    e.preventDefault()
    setWord(input)
  }
  
  useEffect(()=>{
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
      console.log(res);
      })
      return wordArray

    }
    inputLetterArray.forEach(letter => {
      console.log(fetchWord(letter))

    })
    
  },[word])


  return (
    <div className="App">
      <h1>Backronyms</h1>
      <Form handleSubmit={handleSubmit} setInput={setInput} input={input} />
    </div>
  );
}

export default App;
