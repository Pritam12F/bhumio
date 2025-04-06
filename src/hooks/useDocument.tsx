import { gapi } from "gapi-script";
import { useCallback, useEffect, useState } from "react";

export const useDocument = (documentId: string) => {
  const [document, setDocument] = useState();

  const fetchDocument = useCallback(async () => {
    return gapi;
  }, [documentId]);
  useEffect(() => {}, []);

  return { document, setDocument };
};
