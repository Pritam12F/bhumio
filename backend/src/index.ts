import express from "express";
import cors from "cors";
import { initClient } from "./client/google";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/getdocuments", async (req, res) => {
  const authCode = req.headers["authorization"];

  if (!authCode) {
    res.json({
      message: "No auth code provided",
    });

    return;
  }

  const drive = await initClient(authCode);

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

app.listen(3000, () => {
  console.log("Listening");
});
