import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export const useDocument = () => {
  const [documents, setDocuments] = useState<
    { id: string; name: string; mimeType: string }[]
  >([]);

  const fetchDocuments = useCallback(async () => {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/getdocuments`,
      {},
      {
        headers: {
          Authorization: localStorage.getItem("bhumio-oauth.google.authcode"),
        },
      }
    );

    setDocuments([...res.data.files]);
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, []);

  return { documents };
};
