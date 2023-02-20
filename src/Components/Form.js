const Form = ({ handleSubmit, setInput, input, context, setContext, validInput }) => {
    return (
        <form
            onSubmit={handleSubmit}>
            <label htmlFor='acronym' className='sr-only'>What acronym are you creating?</label>
            <div className='inputContainer'>
                <input
                    className={validInput ? 'glow' : 'invalidInput'}
                    type='text'
                    id='acronym'
                    placeholder='What acronym are you creating?'
                    onChange={(e) => setInput(e.target.value)}
                    value={input}/>
                <label htmlFor='context' className='sr-only'>Are there any relevant keywords you want to inform the context of your acronym?</label>
                <input
                    className={validInput ? 'glow' : 'invalidInput'}
                    type='text'
                    id='context'
                    placeholder='Opt: 1-2 keywords for added context'
                    onChange={(e) => setContext(e.target.value)}
                    value={context}/>
            </div>
            <button
                type='submit'
                className='start'
            >Your kids are gonna love it! </button>
        </form>
    )
};

export default Form;