import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [userImageUrl, setUserImageUrl] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        setUserImageUrl(auth.currentUser.photoURL);
      }
      setCheckingStatus(false);
    });
  });
  return { loggedIn, checkingStatus, userImageUrl };
};
