import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [userLocalStorage, setUserLocalStorage] = useLocalStorageState(
    null,
    "user"
  );
  const [userState, setUserState] = useState(userLocalStorage);

  useEffect(() => {
    console.log("testing");
    setUserLocalStorage(userState);
  }, [userState, setUserLocalStorage]);

  function loginUser(userData) {
    setUserState(userData);
  }

  function logoutUser() {
    setUserState(null);
  }

  return (
    <AuthContext.Provider value={{ userState, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useUser() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("AuthContext was used outside of AuthContextProvider");
  }

  return context;
}
