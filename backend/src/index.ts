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
    patientName: matchingPatient[1] + " " + matchingPatient[2] || "",
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

app.post("/edit", async (req, res) => {
  const refresh_token = req.headers["refreshtoken"]?.toString();
  const access_token = req.headers["accesstoken"]?.toString();

  if (!refresh_token || !access_token) {
    res.json({ message: "Token not provided" });
    return;
  }

  const { patientId, spreadsheetId } = req.query;

  if (!patientId || !spreadsheetId) {
    res.json({ message: "No patientId or spreadsheetId provided" });
    return;
  }

  const sheets = await initSheetsClient(refresh_token, access_token);
  const readResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId.toString(),
    range: "patient",
  });

  const rows = readResponse.data.values || [];
  const headerRow = rows[0];
  const patientIdIndex = headerRow.indexOf("ssn");

  if (patientIdIndex === -1) {
    res.json({ message: "No 'patientId' column found." });
    return;
  }

  const matchingRowIndex = rows.findIndex(
    (row, index) => index !== 0 && row[patientIdIndex] === patientId
  );

  if (matchingRowIndex === -1) {
    res.json({ message: "Patient not found." });
    return;
  }

  const {
    patientName,
    address,
    location,
    email,
    phone,
    physicianId,
    physicianName,
    physicianPhone,
    description,
    dose,
    appointmentId,
    visitDate,
    nextVisitDate,
  } = req.body;

  const visitDateString = new Date(visitDate).toLocaleDateString("en-IN");
  const nextVisitDateString = new Date(nextVisitDate).toLocaleDateString(
    "en-IN"
  );

  // Update patient sheet
  await sheets.spreadsheets.values.update({
    spreadsheetId: spreadsheetId.toString(),
    range: `patient!A${matchingRowIndex + 1}:G${matchingRowIndex + 1}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          patientId,
          patientName.split(" ")[0],
          patientName.split(" ")[1] || "",
          address,
          location,
          email,
          phone,
        ],
      ],
    },
  });

  // Update prescription sheet
  const prescriptionResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId.toString(),
    range: "prescribes",
  });

  const prescriptionRows = prescriptionResponse.data.values || [];
  const prescriptionHeader = prescriptionRows[0];
  const prescriptionPatientIdIndex = prescriptionHeader.indexOf("PatientID");

  if (prescriptionPatientIdIndex !== -1) {
    const matchingPrescriptionIndex = prescriptionRows.findIndex(
      (row, index) =>
        index !== 0 && row[prescriptionPatientIdIndex] === patientId
    );

    if (matchingPrescriptionIndex !== -1) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId.toString(),
        range: `prescribes!A${matchingPrescriptionIndex + 1}:D${
          matchingPrescriptionIndex + 1
        }`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[physicianId, patientId, description, dose]],
        },
      });
    } else {
      console.log("No matching prescription found.");
    }
  } else {
    console.log("No 'PatientID' column in prescribes sheet.");
  }

  // Update appointment sheet
  const appointmentsResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId.toString(),
    range: "appointment",
  });

  const appointmentRows = appointmentsResponse.data.values || [];
  const appointmentHeader = appointmentRows[0];
  const appointmentPatientIdIndex = appointmentHeader.indexOf("patientID");

  if (appointmentPatientIdIndex !== -1) {
    const matchingAppointmentIndex = appointmentRows.findIndex(
      (row, index) =>
        index !== 0 && row[appointmentPatientIdIndex] === patientId
    );

    if (matchingAppointmentIndex !== -1) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId.toString(),
        range: `appointment!A${matchingAppointmentIndex + 1}:E${
          matchingAppointmentIndex + 1
        }`,
        valueInputOption: "RAW",
        requestBody: {
          values: [
            [
              appointmentId,
              patientId,
              physicianId,
              visitDateString,
              nextVisitDateString,
            ],
          ],
        },
      });
    } else {
      console.log("No matching appointment found.");
    }
  } else {
    console.log("No 'patientID' column in appointments sheet.");
  }

  // Update physician sheet
  const physicianResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId.toString(),
    range: "physician",
  });

  const physicianHeaderRow = physicianResponse.data.values?.[0] || [];
  const physicianIdIndex = physicianHeaderRow.indexOf("employeeid");

  if (physicianIdIndex !== -1) {
    const matchingPhysicianIndex = (
      physicianResponse.data.values ?? []
    ).findIndex(
      (row, index) => index !== 0 && row[physicianIdIndex] === physicianId
    );

    if (matchingPhysicianIndex !== -1) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId.toString(),
        range: `prescribes!A${matchingPhysicianIndex + 1}:D${
          matchingPhysicianIndex + 1
        }`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[physicianId, physicianName, "Sr Doctor", physicianPhone]],
        },
      });
    } else {
      console.log("No matching physician found.");
    }
  } else {
    console.log("No 'PhysicianID' column in physician sheet.");
  }

  res.json({ message: "Patient details updated successfully." });
});

app.listen(3000, () => {
  console.log("Listening");
});
