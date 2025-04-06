import React, { useState, useEffect, ReactNode } from "react";
import { gapi } from "gapi-script";
import { GoogleAuthContext } from "./context";
import {
  API_KEY,
  CLIENT_ID,
  DISCOVERY_DOCS,
  SCOPES,
} from "../../services/g-drive";

interface AuthProviderProps {
  children: ReactNode;
}

export const GoogleAuthProvider = ({ children }: AuthProviderProps) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const initClient = () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        })
        .then(() => {
          const auth = gapi.auth2.getAuthInstance();

          // Initial sign-in state
          setIsSignedIn(auth.isSignedIn.get());

          // Update state on sign-in change
          auth.isSignedIn.listen(setIsSignedIn);

          if (auth.isSignedIn.get()) {
            const user = auth.currentUser.get();
            const token = user.getAuthResponse().access_token;
            setAccessToken(token);
          }
        })
        .catch((err: any) => {
          console.error("GAPI Init Error", err);
        });
    };

    gapi.load("client:auth2", initClient);
  }, []);

  const signIn = () => {
    const auth = gapi.auth2.getAuthInstance();
    auth.signIn().then((user: any) => {
      const token = user.getAuthResponse().access_token;
      setAccessToken(token);
      setIsSignedIn(true);
    });
  };

  const signOut = () => {
    const auth = gapi.auth2.getAuthInstance();
    auth.signOut().then(() => {
      setAccessToken(null);
      setIsSignedIn(false);
    });
  };

  return (
    <GoogleAuthContext.Provider
      value={{ isSignedIn, signIn, signOut, accessToken }}
    >
      {children}
    </GoogleAuthContext.Provider>
  );
};
