import { createContext } from "react";

interface GoogleAuthContextType {
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
  accessToken: string | null;
  document: string | null;
  setDocument: React.Dispatch<React.SetStateAction<string | null>> | null;
}

export const GoogleAuthContext = createContext<GoogleAuthContextType>({
  isSignedIn: false,
  signIn: () => {},
  signOut: () => {},
  accessToken: null,
  document: null,
  setDocument: () => {},
});
