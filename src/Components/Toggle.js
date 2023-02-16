import { FaSun, FaMoon } from "react-icons/fa";
export default function Toggle({toggleTheme, theme}){
    return (
        <div className='toggle'>
          <input type='checkbox' onClick={toggleTheme} />
          {theme === 'dark' ? <FaMoon className='toggleIcon'/> : <FaSun className='toggleIcon'/>}
        </div>
    )
}