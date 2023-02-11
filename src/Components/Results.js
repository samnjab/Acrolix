const Results = ({results}) => {
    const randomItem = (array) => {
        const randomNumber = Math.floor(Math.random() * array.length)
        return array[randomNumber];
    }
    
    const resultsToDisplay = results.map( (letter) => {
        const letterArray = [];
        for(let i = 0; i < 3; i++){
            letterArray.push(randomItem(letter));
        }
        return letterArray;
        // *** NEED TO FIX - GIVES ERROR FOR SAME KEY BEING USED TWICE ***
    })
    console.log(resultsToDisplay);

    return (
        <>
        {resultsToDisplay.map( (letter, index) => {
            return <ul key={index}>
                {letter.map( (word) => {
                    return <li key={word.score}>
                        {word.word}
                    </li>
                })}
            </ul>
        })}
        {/* {results.length === 0 ? <> </> : <p>{results[0][0].word}</p>} */}
        </>
    )
}

export default Results;

// End result: we want an array of arrays
    // each array contains 1 word
    // for each index we get a random word
        // push that random word to resultsToDisplay array
            // map through resultsToDisplay array
                // each index will return an unordered list of words

