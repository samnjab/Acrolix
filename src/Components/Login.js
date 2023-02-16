import React, { useEffect, useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";

function Login({ setIsLoggedIn }) {
  const [userID, setUserID] = useState("");
  
  const handleClick = () => {
    signInWithPopup(auth, provider).then((data) => {
      setUserID(data.user.email);
      //keeps user signed in on page refresh
      localStorage.setItem("email", data.user.email);
      setIsLoggedIn(true);
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