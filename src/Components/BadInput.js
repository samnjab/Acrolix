const BadInput = ({lengthError, letterError}) => {
    console.log('lengthError:', lengthError, 'letterError:', letterError)
    return (
        <div className='badInput'> 
            <p>Bad Input</p>
            {
                letterError && lengthError ?
                <>
                    <p>Words must be between 2 & 10 characters.</p>
                    <p>Letters only. </p>
                </>
                :
                lengthError ? 
                    <p>Words must be between 2 & 10 characters.</p>
                : letterError ?
                    <p>Letters only</p>
                :
                <></>
            }
            
        </div>
    )
};

export default BadInput;