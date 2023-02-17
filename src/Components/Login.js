import React, { useEffect, useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth"; 
import { getDatabase, ref, set, onValue } from "firebase/database";


function Login({ setIsLoggedIn, setUser }) {
  const [userID, setUserID] = useState("");

  const handleClick = () => {
    signInWithPopup(auth, provider).then((data) => {
      //keeps user signed in on page refresh
      // localStorage.setItem("email", data.user.email);
      // localStorage.setItem("user", data.user.uid);
      function writeUserData(userID) {
        const db = getDatabase();
        const dbkey = set(ref(db, 'users/' + userID), {
          userId: userID
        });
        setIsLoggedIn(true);
        setUserID(dbkey.key)
        console.log(userID)
      }
      writeUserData(data.user.uid);
    });
  };


  useEffect(() => {
    setUserID(localStorage.getItem("email"));
  }, []);

  const logout = () => {
    signOut(auth);
    localStorage.clear();
    window.location.reload();
    setIsLoggedIn(false);
  };

  return (
    <div className="signIn">
      {userID ? (
        <button onClick={logout}>Log Out</button>
      ) : (
        <button onClick={handleClick}>Sign In With Google</button>
      )}
    </div>
  );
}

export default Login;