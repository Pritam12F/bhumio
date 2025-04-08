import React, { useContext, useState } from "react";
import { TextField, Paper, Typography, Input } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GoogleAuthContext } from "../context/auth/context";
import { useSearch } from "../hooks/useSearch";

const SearchPatient = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { document } = useContext(GoogleAuthContext);
  const { result } = useSearch(searchTerm, document ?? "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper className="min-w-fit min-h-fit mx-auto" elevation={0}>
        <form className="space-y-6">
          <div>
            <Typography variant="subtitle2" className="mb-1">
              Search
            </Typography>
            <div className="flex gap-2">
              <TextField
                size="small"
                name="searchTerm"
                value={searchTerm}
                onChange={handleChange}
                fullWidth
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Typography variant="subtitle2" className="mb-1">
                Patient ID
              </Typography>
              <TextField
                size="small"
                name="patientId"
                value={result?.patientId}
                onChange={handleChange}
                fullWidth
                disabled
              />
            </div>
            <div>
              <Typography variant="subtitle2" className="mb-1">
                Patient Name (First, Last Name)
              </Typography>
              <TextField
                size="small"
                name="patientName"
                value={result?.patientName}
                onChange={handleChange}
                fullWidth
                disabled
              />
            </div>
            <div>
              <Typography variant="subtitle2" className="mb-1">
                Location
              </Typography>
              <TextField
                size="small"
                name="location"
                value={result?.location}
                onChange={handleChange}
                fullWidth
                disabled
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
                value={result}
                onChange={handleChange}
                fullWidth
                disabled
              />
            </div>
            <div>
              <Typography variant="subtitle2" className="mb-1">
                Phone
              </Typography>
              <TextField
                size="small"
                name="phone"
                value={result?.phone}
                onChange={handleChange}
                fullWidth
                disabled
              />
            </div>
            <div className="col-span-2">
              <Typography variant="subtitle2" className="mb-1">
                Address
              </Typography>
              <TextField
                size="small"
                name="address"
                value={result?.address}
                onChange={handleChange}
                fullWidth
                disabled
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
                value={result?.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                disabled
              />
            </div>
            <div>
              <Typography variant="subtitle2" className="mb-1">
                Dose
              </Typography>
              <TextField
                size="small"
                name="dose"
                value={result?.dose}
                onChange={handleChange}
                fullWidth
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="subtitle2" className="mb-1">
                Visit Date
              </Typography>
              <Input disabled value={result?.visitDate} />
            </div>
            <div>
              <Typography variant="subtitle2" className="mb-1">
                Next Visit
              </Typography>
              <Input disabled value={result?.nextVisitDate} />
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
                value={result?.physicianId}
                onChange={handleChange}
                fullWidth
                disabled
              />
            </div>
            <div>
              <Typography variant="subtitle2" className="mb-1">
                Physician Name (First, Last Name)
              </Typography>
              <TextField
                size="small"
                name="physicianName"
                value={result?.physicianName}
                onChange={handleChange}
                fullWidth
                disabled
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
                value={result?.physicianPhone}
                onChange={handleChange}
                fullWidth
                disabled
              />
            </div>
          </div>
        </form>
      </Paper>
    </LocalizationProvider>
  );
};

export default SearchPatient;
