import { createContext } from "react";

interface GoogleAuthContextType {
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
  accessToken: string | null;
}

export const GoogleAuthContext = createContext<GoogleAuthContextType>({
  isSignedIn: false,
  signIn: () => {},
  signOut: () => {},
  accessToken: null,
});
