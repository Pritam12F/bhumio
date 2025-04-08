import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

export const initClient = async (
  refresh_token: string,
  access_token: string
) => {
  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token,
    refresh_token,
  });

  const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
  });

  return drive;
};
