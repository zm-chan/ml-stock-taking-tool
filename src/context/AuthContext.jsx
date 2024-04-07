import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [userState, setUserState] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserState(user);
      // console.log(user);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ userState }}>
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
