const Form = ({ setInput, input, validInput }) => {
    return (
        <form
            onSubmit={(e)=> {
                e.preventDefault()
                setInput('');
                }}>
            <label htmlFor='acronym' className='sr-only'>What acronym are you creating?</label>
            <div className='inputContainer'>
                <input
                    className={validInput ? 'glow' : 'invalidInput'}
                    type='text'
                    id='acronym'
                    placeholder='What acronym are you creating?'
                    onChange={(e) => setInput(e.target.value)}
                    value={input}/>
            </div>
        </form>
    )
};

export default Form;