import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useAuthStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [userImageUrl, setUserImageUrl] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserImageUrl(auth.currentUser.photoURL);
      }
      setCheckingStatus(false);
    });
  });
  return { isLoggedIn, checkingStatus, userImageUrl };
};
