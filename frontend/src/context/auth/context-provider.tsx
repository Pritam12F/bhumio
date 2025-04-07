import { useCallback, useContext, useState } from "react";
import { GoogleAuthContext } from "./context";

export const GoogleAuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  const signIn = () => {
    console.log("Hi there");
    setIsSignedIn(true);
    return 1;
  };

  const signOut = () => {
    setIsSignedIn(false);
  };
  return (
    <GoogleAuthContext.Provider
      value={{
        isSignedIn,
        signIn,
        signOut,
        accessToken: null,
        document: null,
        setDocument: null,
      }}
    >
      {children}
    </GoogleAuthContext.Provider>
  );
};
