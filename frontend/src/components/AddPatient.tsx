import React, { useContext, useState } from "react";
import { TextField, Paper, Typography, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { GoogleAuthContext } from "../context/auth/context";
import axios from "axios";

interface PatientFormData {
  patientName: string;
  address: string;
  location: string;
  email: string;
  phone: string;
  physicianId: string;
  physicianName: string;
  physicianPhone: string;
  description: string; // assuming this is the prescription/notes
  dose: string;
  appointmentId: string;
  visitDate: dayjs.Dayjs;
  nextVisitDate: dayjs.Dayjs;
}

const AddPatient = () => {
  const [formData, setFormData] = useState<PatientFormData>({
    patientName: "",
    address: "",
    location: "",
    email: "",
    phone: "",
    physicianId: "",
    physicianName: "",
    physicianPhone: "",
    description: "",
    dose: "",
    appointmentId: "",
    visitDate: dayjs(),
    nextVisitDate: dayjs(),
  });
  const { document } = useContext(GoogleAuthContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/add?spreadsheetId=${document}`,
        { ...formData },
        {
          headers: {
            Refreshtoken: localStorage.getItem("google-refresh-token"),
            Accesstoken: localStorage.getItem("google-access-token"),
          },
        }
      );

      alert("Added patient!");
    } catch {
      console.error("Couldn't add patient");
      alert("Couldn't add patient");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper className="p-6 min-w-fit min-h-fit mx-auto" elevation={0}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Typography variant="subtitle2" className="mb-1">
                Patient Name (First, Last Name)
              </Typography>
              <TextField
                size="small"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                fullWidth
              />
            </div>
            <div>
              <Typography variant="subtitle2" className="mb-1">
                Location
              </Typography>
              <TextField
                size="small"
                name="location"
                value={formData.location}
                onChange={handleChange}
                fullWidth
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <Typography variant="subtitle2" className="mb-1">
                Phone
              </Typography>
              <TextField
                size="small"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
              />
            </div>
            <div className="col-span-2">
              <Typography variant="subtitle2" className="mb-1">
                Address
              </Typography>
              <TextField
                size="small"
                name="address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
              />
            </div>
          </div>
          <hr></hr>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="subtitle2" className="mb-1">
                Prescription
              </Typography>
              <TextField
                size="small"
                name="prescription"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </div>
            <div>
              <Typography variant="subtitle2" className="mb-1">
                Dose
              </Typography>
              <TextField
                size="small"
                name="dose"
                value={formData.dose}
                onChange={handleChange}
                fullWidth
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="subtitle2" className="mb-1">
                Visit Date
              </Typography>
              <DatePicker
                value={formData.visitDate}
                onChange={(newValue) =>
                  setFormData((prev) => ({ ...prev, visitDate: newValue! }))
                }
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                  },
                }}
              />
            </div>
            <div>
              <Typography variant="subtitle2" className="mb-1">
                Next Visit
              </Typography>
              <DatePicker
                value={formData.nextVisitDate}
                onChange={(newValue) =>
                  setFormData((prev) => ({ ...prev, nextVisit: newValue }))
                }
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                  },
                }}
              />
            </div>
          </div>
          <hr></hr>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="subtitle2" className="mb-1">
                Physician ID
              </Typography>
              <TextField
                size="small"
                name="physicianId"
                value={formData.physicianId}
                onChange={handleChange}
                fullWidth
              />
            </div>
            <div>
              <Typography variant="subtitle2" className="mb-1">
                Physician Name (First, Last Name)
              </Typography>
              <TextField
                size="small"
                name="physicianName"
                value={formData.physicianName}
                onChange={handleChange}
                fullWidth
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="subtitle2" className="mb-1">
                Phone
              </Typography>
              <TextField
                size="small"
                name="physicianPhone"
                value={formData.physicianPhone}
                onChange={handleChange}
                fullWidth
              />
            </div>
          </div>
          <div className="w-full flex justify-center">
            <Button type="submit" variant="outlined">
              Add Patient
            </Button>
          </div>
        </form>
      </Paper>
    </LocalizationProvider>
  );
};

export default AddPatient;
