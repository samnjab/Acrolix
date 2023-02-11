const Form = ({ handleSubmit, setInput, input}) => {
    return(
        <form
        onSubmit={handleSubmit}>
            <label htmlFor='acronym' className='sr-only'></label>
            <input 
            type='text' 
            id ='acronym' 
            placeholder='Enter a Word'
            onChange={(e)=> setInput(e.target.value)}
            value={input}/>
            <button 
            type='submit'
            >Submit</button>
        </form>
    )
}
export default Form;