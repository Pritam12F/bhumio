import { useCallback, useEffect, useState } from "react";
import { GoogleAuthContext } from "./context";
import axios from "axios";

export const GoogleAuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [document, setDocument] = useState<string | null>(null);

  const signIn = useCallback(() => {
    setIsSignedIn(true);
  }, []);

  const signOut = useCallback(() => {
    setIsSignedIn(false);
  }, []);

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/getdocuments`,
        {},
        {
          headers: {
            Authorization:
              localStorage.getItem("bhumio-oauth.google.authcode") || "",
          },
        }
      );

      setDocuments([...res.data.files]);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      fetchDocuments();
    }
  }, [isSignedIn, fetchDocuments]);

  return (
    <GoogleAuthContext.Provider
      value={{
        isSignedIn,
        signIn,
        signOut,
        document,
        setDocument,
        documents,
        fetchDocuments,
      }}
    >
      {children}
    </GoogleAuthContext.Provider>
  );
};
