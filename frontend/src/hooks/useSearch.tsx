import { useCallback, useEffect, useState } from "react";
import axios from "axios";

export interface PatientFormData {
  patientId: string;
  patientName: string;
  address: string;
  location: string;
  email: string;
  phone: string;
  physicianId: string;
  physicianName: string;
  physicianPhone: string;
  description: string;
  dose: string;
  appointmentId: string;
  visitDate: string;
  nextVisitDate: string;
}

export const useSearch = (searchTerm: string, document: string) => {
  const [result, setResult] = useState<PatientFormData>();
  const [name, setName] = useState("");
  const [patientId, setPatientId] = useState("");

  const fetchPatient = useCallback(async () => {
    const res = await axios.post(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/search?q=${searchTerm}&spreadsheetId=${document}`,
      {},
      {
        headers: {
          Refreshtoken: localStorage.getItem("google-refresh-token"),
          Accesstoken: localStorage.getItem("google-access-token"),
        },
      }
    );

    setResult(res.data.results);
    setName(res.data.results.patientName);
    setPatientId(res.data.results.patientId);
  }, [searchTerm, document]);

  useEffect(() => {
    fetchPatient();
  }, [searchTerm, document]);

  return { result, name, patientId };
};
