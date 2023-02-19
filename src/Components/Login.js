import React, { useEffect, useState } from "react";
import { auth, provider } from "../firebase";

import { signInWithPopup, signOut } from "firebase/auth";
import { getDatabase, ref, set, onValue, push } from "firebase/database";

function Login({ isLoggedIn, setIsLoggedIn, setUserKey, userKey}) {
  const [userID, setUserID] = useState("");
  const handleClick = () => {
    signInWithPopup(auth, provider).then((data) => {
      //keeps user signed in on page refresh
      localStorage.setItem("email", data.user.email);
      // localStorage.setItem("user", data.user.uid);
      function writeUserData(userID) {
        const db = getDatabase();
        const dbKey = push(ref(db, 'users/' + userID), null);
        setIsLoggedIn(true);
        setUserID(dbKey.key)
        setUserKey(userID)
      }
      writeUserData(data.user.uid);
    });
  };

  const logout = () => {
    signOut(auth);
    localStorage.clear();
    window.location.reload();
    setIsLoggedIn(false);
    console.log(userID)
    setUserID('')
  };
  
  return (
    <div className="signIn">
      {isLoggedIn ? (
        <button onClick={logout}>Log Out</button>
      ) : (
        <button onClick={handleClick}>Sign In With Google</button>
      )}
    </div>
  );
}
export default Login;