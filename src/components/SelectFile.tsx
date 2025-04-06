import { Button, Paper } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { GoogleAuthContext } from "../context/auth/context";
import { listFiles } from "../services/g-drive";

export const SelectFile = () => {
  const { isSignedIn, signIn, signOut, accessToken } =
    useContext(GoogleAuthContext);
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    async function fetchFiles() {
      const res = await listFiles();

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
        <div>{JSON.stringify(fileList)}</div>
      ) : (
        <Button onClick={signIn} variant={"contained"}>
          Sign in
        </Button>
      )}
    </Paper>
  );
};
