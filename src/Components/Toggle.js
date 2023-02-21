const Toggle = ({toggleTheme, theme}) => {
    return (
        <div className='toggle'>
          <input type='checkbox' onClick={toggleTheme} />
          {theme === 'dark' ? <i className=' toggleIcon fa-solid fa-moon'></i> : <i className='toggleIcon fa-solid fa-sun'></i>}
        </div>
    )
};

export default Toggle;