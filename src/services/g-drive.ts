import { gapi } from "gapi-script";

export const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
export const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];

export const SCOPES = "https://www.googleapis.com/auth/drive";

export const initClient = () => {
  return gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    .then(
      () => {
        console.log("GAPI client initialized.");
      },
      (error) => {
        console.error("Error initializing GAPI client:", error);
      }
    );
};

export const signIn = () => {
  return gapi.auth2.getAuthInstance().signIn();
};

export const signOut = () => {
  return gapi.auth2.getAuthInstance().signOut();
};

// Additional API methods (e.g., readFile, updateFile, deleteFile)

export const listSpreadsheetFiles = async (): Promise<
  (typeof gapi.client.drive.File)[]
> => {
  try {
    const response = await gapi.client.drive.files.list({
      pageSize: 100,
      fields: "files(id, name, mimeType)",
    });

    const files = response.result.files;
    return (
      files.filter(
        (x: any) => x.mimeType === "application/vnd.google-apps.spreadsheet"
      ) || []
    );
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
};
