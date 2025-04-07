import express from "express";
import cors from "cors";
import { url } from "./client/google";
import { verifyGoogleToken } from "./decode";

const app = express();

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  const token = req.body.token;
  const payload = await verifyGoogleToken(token);
  if (payload?.email) {
    next();
    return;
  }

  res.send("Invalid user");
});

app.post("/", (req, res) => {
  res.json({ url });
});

app.listen(3000, () => {
  console.log("Listening");
});
