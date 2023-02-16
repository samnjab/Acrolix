const Form = ({ handleSubmit, setInput, input, validInput}) => {
    return(
        <form
        onSubmit={handleSubmit}>
            <label htmlFor='acronym' className='sr-only'></label>
            <input 
            className={validInput ? 'glow' : 'invalid-input'} 
            type='text'
            id ='acronym' 
            placeholder='Enter a Word'
            onChange={(e)=> setInput(e.target.value)}
            value={input}/>
            <button 
            type='submit' 
            className='doNotPush'
            >Do Not Push! </button>
        </form>
    )
}
export default Form;