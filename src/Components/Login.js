import { auth, provider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { getDatabase, ref, push } from 'firebase/database';

function Login({ isLoggedIn, setIsLoggedIn, setUserKey }) {
  const handleClick = () => {
    signInWithPopup(auth, provider).then((data) => {
      //keeps user signed in on page refresh
      localStorage.setItem('email', data.user.email);
      function writeUserData(userID) {
        const db = getDatabase();
        push(ref(db, 'users/' + userID), null);
        setIsLoggedIn(true);
        setUserKey(userID);
      }
      writeUserData(data.user.uid);
    });
  };

  const logout = () => {
    signOut(auth);
    localStorage.clear();
    window.location.reload();
    setIsLoggedIn(false);
    setUserKey('');
  };
  
  return (
    <div className='signIn'>
      {isLoggedIn ? (
        <button onClick={logout}>Log Out</button>
      ) : (
        <button onClick={handleClick}>Sign In With Google</button>
      )}
    </div>
  )
};

export default Login;