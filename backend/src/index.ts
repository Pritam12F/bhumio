import express from "express";
import cors from "cors";
import { initClient } from "./client/g-drive";
import { initClient as initSheetsClient } from "./client/g-sheets";
import dotenv from "dotenv";
import { google } from "googleapis";

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const app = express();

app.use(cors());
app.use(express.json());

app.post("/signin", async (req, res) => {
  const authCode = req.headers["authorization"];

  if (!authCode) {
    res.json({
      message: "No auth code provided",
    });

    return;
  }

  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  const { tokens } = await oauth2Client.getToken(authCode);

  res.json({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
  });
});

app.post("/getdocuments", async (req, res) => {
  const refresh_token = req.headers["refreshtoken"]?.toString();
  const access_token = req.headers["accesstoken"]?.toString();

  if (!refresh_token || !access_token) {
    res.json({
      message: "Token not provided",
    });

    return;
  }

  const drive = await initClient(refresh_token, access_token);

  const response = await drive.files.list({
    pageSize: 300,
    fields: "files(id, name, mimeType)",
  });

  const files = response.data.files?.filter(
    (el) => el.mimeType === "application/vnd.google-apps.spreadsheet"
  );

  res.json({ files });
});

app.post("/addpatients", async (req, res) => {});

app.post("/search", async (req, res) => {
  const refresh_token = req.headers["refreshtoken"]?.toString();
  const access_token = req.headers["accesstoken"]?.toString();

  if (!refresh_token || !access_token) {
    res.json({
      message: "Token not provided",
    });

    return;
  }

  const { q, spreadsheetId } = req.query;

  if (!q || !spreadsheetId) {
    res.json({
      message: "No search string or spreadsheet id provided",
    });

    return;
  }

  const sheets = await initSheetsClient(refresh_token, access_token);

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId?.toString(),
    range: "patient",
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    console.log("No data found.");
    res.json({ message: "No data" });
    return;
  }

  const dataRows = rows.slice(1);
  const searchTerm = q.toString().toLowerCase();

  const matchingPatient = dataRows.filter((row) =>
    row.some((cell) => cell?.toLowerCase().includes(searchTerm))
  )[0];
  const matchingId = matchingPatient[0];

  const prescription = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId?.toString(),
    range: "prescribes",
  });

  const matchingPrescription = prescription.data.values
    ?.slice(1)
    .filter((row) =>
      row.some((cell) => cell?.toLowerCase().includes(matchingId))
    )?.[0];

  const appointment = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId?.toString(),
    range: "appointment",
  });

  const matchingAppointment = appointment.data.values
    ?.slice(1)
    .filter((row) =>
      row.some((cell) => cell?.toLowerCase().includes(matchingId))
    )[0];

  const doctors = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId?.toString(),
    range: "physician",
  });

  const matchingDoctor = doctors.data.values
    ?.slice(1)
    .filter((row) =>
      row.some((cell) =>
        cell?.toLowerCase().includes(matchingPrescription?.[0])
      )
    )[0];

  const results = {
    patientId: matchingPatient[0],
    patientName: matchingPatient[1] + matchingPatient[2] || "",
    address: matchingPatient[3] ?? "",
    location: matchingPatient[4] ?? "",
    email: matchingPatient[5] ?? "",
    phone: matchingPatient[6] ?? "",
    physicianId: matchingPrescription?.[0] ?? "",
    physicianName: matchingDoctor?.[0] ?? "",
    physicianPhone: matchingDoctor?.[3] ?? "",
    description: matchingPrescription?.[2] ?? "",
    dose: matchingPrescription?.[3] ?? "",
    appointmenId: matchingAppointment?.[0] ?? "",
    visitDate: matchingAppointment?.[3] ?? "",
    nextVisitDate: matchingAppointment?.[4] ?? "",
  };

  res.json({ results });
});

app.listen(3000, () => {
  console.log("Listening");
});
