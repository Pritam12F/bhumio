import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
});

const scopes = ["https://www.googleapis.com/auth/drive"];

export const url = oauth2Client.generateAuthUrl({
  access_type: "offline",

  scope: scopes,
});
