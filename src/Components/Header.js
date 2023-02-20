import { Link } from 'react-router-dom';
import HeaderImg from '../assets/header-image.png'
import Form from './Form';

const Header = ({ handleSubmit, setInput, input, context, setContext, validInput }) => {
    return (
        <header>
            <Link to='/'>
                <h1 className='sr-only'>Back to the Acronym</h1>
                <img src={HeaderImg} alt='Back to the Acronym'/>
            </Link>
            <Form
                validInput={validInput}
                handleSubmit={handleSubmit}
                setInput={setInput}
                input={input}
                context={context}
                setContext={setContext}/>
        </header>
    )
};

export default Header;