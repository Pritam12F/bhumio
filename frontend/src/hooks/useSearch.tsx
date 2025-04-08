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
  appointmenId: string;
  visitDate: string;
  nextVisitDate: string;
}

export const useSearch = (searchTerm: string, document: string) => {
  const [result, setResult] = useState<PatientFormData>();

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
    console.log(res.data);
    setResult(res.data.results);
  }, [searchTerm, document]);

  useEffect(() => {
    fetchPatient();
  }, [searchTerm, document]);

  return { result };
};
