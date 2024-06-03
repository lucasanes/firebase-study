"use client";

import { User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../../firebase.config";

interface AuthContextProps {
  signOut: () => void;
  user: User;
  token: string;
}

interface DataProps {
  user: User;
  token: string;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DataProps>({} as DataProps);

  function signOut() {
    auth.signOut();
    setData({} as DataProps);
  }

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setData({
          user: user,
          token: user.refreshToken,
        });
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signOut,
        user: data?.user,
        token: data?.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
