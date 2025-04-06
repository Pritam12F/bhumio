import { gapi } from "gapi-script";
import { useEffect, useState } from "react";
import {
  API_KEY,
  CLIENT_ID,
  DISCOVERY_DOCS,
  SCOPES,
} from "../services/g-drive";

export const useGapi = () => {
  const [gapiInitialized, setGapiInitialized] = useState<boolean>(false);

  useEffect(() => {
    const initClient = () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        })
        .then(
          () => {
            console.log("GAPI client initialized.");
            setGapiInitialized(true);
          },
          (error) => {
            console.error("Error initializing GAPI client:", error);
          }
        );
    };

    gapi.load("client:auth2", initClient);
  }, []);

  if (!gapiInitialized) {
    return <div>Loading...</div>; // You can replace this with a loader/spinner
  }
};
