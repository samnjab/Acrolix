const Form = ({ setInput, input, validInput }) => {
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
                onChange={(e) => setInput(e.target.value)}
                value={input}/>
        </form>
    )
};

export default Form;