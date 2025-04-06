import { Button, Paper } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { GoogleAuthContext } from "../context/auth/context";
import { listSpreadsheetFiles } from "../services/g-drive";
import { SelectMenu } from "./SelectMenu";

export const SelectFile = () => {
  const { isSignedIn, signIn, signOut, setDocument } =
    useContext(GoogleAuthContext);
  const [fileList, setFileList] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    async function fetchFiles() {
      const res = (await listSpreadsheetFiles()).map((x: any) => {
        const url = `https://docs.google.com/spreadsheets/d/${x.id}`;
        const name = x.name;

        return {
          name,
          url,
        };
      });

      console.log(res);

      setFileList([...res]);
    }

    fetchFiles();
  }, []);
  return (
    <Paper
      className="min-w-full min-h-screen mx-auto flex justify-center items-center"
      elevation={0}
    >
      {isSignedIn ? (
        <div className="flex flex-col items-center space-y-10">
          <Button onClick={signOut} variant={"contained"} className="w-[200px]">
            Sign out
          </Button>
          <SelectMenu sheetList={fileList} setDocument={setDocument} />
        </div>
      ) : (
        <Button onClick={signIn} variant={"contained"}>
          Sign in
        </Button>
      )}
    </Paper>
  );
};
