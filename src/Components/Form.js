const Form = ({ setInput, input, validInput, setStopTyping }) => {
    return (
        <form
            onSubmit={(e)=> {
                e.preventDefault()
                setInput('');
                }}>
            <label htmlFor='acronym' className='sr-only'>Type Word</label>
           
            <input
                className={validInput ? 'glow' : 'invalidInput'}
                type='text'
                id='acronym'
                placeholder='Type Word'
                onChange={(e) => {
                    setInput(e.target.value)
                    setStopTyping(true)
                }}
                value={input}/>
        </form>
    )
};

export default Form;