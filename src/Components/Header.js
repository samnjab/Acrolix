import { Link } from 'react-router-dom';
import Form from './Form';

const Header = ({ handleSubmit, setInput, input, validInput }) => {
    return (
        <header>
            <Link to='/'>
                <h1 className='sr-only'>Back to the Acronym: Backronym Generator</h1>
            </Link>
            <Form
                validInput={validInput}
                handleSubmit={handleSubmit}
                setInput={setInput}
                input={input}
            />
        </header>
    )
};

export default Header;