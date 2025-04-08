import { Button, Paper } from "@mui/material";
import { useContext } from "react";
import { GoogleAuthContext } from "../context/auth/context";
import { useGoogleLogin } from "@react-oauth/google";
import { SelectMenu } from "./SelectMenu";

export const SelectFile = () => {
  const { isSignedIn, signIn, signOut } = useContext(GoogleAuthContext);

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      localStorage.setItem("bhumio-oauth.google.authcode", codeResponse.code);
      signIn();
    },
    onError: () => {
      console.log("Login Failed");
    },
    scope: "https://www.googleapis.com/auth/drive",
  });

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
          <SelectMenu />
        </div>
      ) : (
        <Button
          onClick={() => {
            login();
          }}
        >
          Sign in with google
        </Button>
      )}
    </Paper>
  );
};
