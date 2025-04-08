import { createContext } from "react";

interface Document {
  id: string;
  name: string;
  mimeType: string;
}

interface GoogleAuthContextType {
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;

  document: string | null;
  setDocument: React.Dispatch<React.SetStateAction<string | null>> | null;

  documents: Document[];
  fetchDocuments: () => Promise<void>;
}

export const GoogleAuthContext = createContext<GoogleAuthContextType>({
  isSignedIn: false,

  signIn: () => {},
  signOut: () => {},

  document: null,
  setDocument: () => {},

  documents: [],
  fetchDocuments: async () => {},
});
