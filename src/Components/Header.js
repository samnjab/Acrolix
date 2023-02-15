import HeaderImg from '../assets/header-image.png'

const Header = (props) => {
    return (
        <header>
            <h1 className='sr-only'>Back to the Acronym</h1>
            <img src={HeaderImg} alt="Back to the Acronym" />
            <button onClick={props.toggleTheme}>toggle mode</button>
        </header>
    )
}

export default Header;