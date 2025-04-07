import React, { useContext, useState } from "react";
import {
  TextField,
  Paper,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { ChevronDown } from "lucide-react";
import { GoogleAuthContext } from "../context/auth/context";

export interface PatientFormData {
  patientId: string;
  patientName: string;
  age: string;
  phone: string;
  address: string;
  location: string;
  prescription: string;
  dose: string;
  visitDate: dayjs.Dayjs | null;
  nextVisit: dayjs.Dayjs | null;
  physicianId: string;
  physicianName: string;
  physicianPhone: string;
  bill: string;
}

const AddPatient = () => {
  const [formData, setFormData] = useState<PatientFormData>({
    patientId: "",
    patientName: "",
    age: "",
    phone: "",
    address: "",
    location: "",
    prescription: "",
    dose: "",
    visitDate: dayjs(),
    nextVisit: dayjs(),
    physicianId: "",
    physicianName: "",
    physicianPhone: "",
    bill: "",
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
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper className="p-6 min-w-fit min-h-fit mx-auto" elevation={0}>
        {document}
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
                Age
              </Typography>
              <TextField
                size="small"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <IconButton size="small">
                      <ChevronDown size={16} />
                    </IconButton>
                  ),
                }}
              />
            </div>
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
                value={formData.prescription}
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
                  setFormData((prev) => ({ ...prev, visitDate: newValue }))
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
                value={formData.nextVisit}
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
            <div>
              <Typography variant="subtitle2" className="mb-1">
                Bill
              </Typography>
              <TextField
                size="small"
                name="bill"
                type="number"
                value={formData.bill}
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
