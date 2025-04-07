import { Button, Paper } from "@mui/material";
import { useContext } from "react";
import { GoogleAuthContext } from "../context/auth/context";
import { GoogleLogin } from "@react-oauth/google";
import { SelectMenu } from "./SelectMenu";
import axios from "axios";

export const SelectFile = () => {
  const { isSignedIn, signIn, signOut, setDocument } =
    useContext(GoogleAuthContext);

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
          {/* <SelectMenu sheetList={fileList} setDocument={setDocument} /> */}
        </div>
      ) : (
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            signIn();

            try {
              axios.post(import.meta.env.VITE_BACKEND_URL, {
                token: credentialResponse.credential,
              });
            } catch (e) {
              console.log(e);
            }

            console.log(credentialResponse);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      )}
    </Paper>
  );
};
