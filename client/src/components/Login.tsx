import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import { useContext, useState } from "react";
import { SERVER_URI } from "../App";
import favicon from "../assets/favicon.png";
import { GoogleIcon } from "../assets/icons";
import { UserContext } from "../contexts";
import Blank from "./Blank";
import FetchErrorMessage from "./FetchErrorMessage";
import Loader from "./Loader";

export default function Login({
  isLoading,
  isError,
}: {
  isLoading: boolean;
  isError: boolean;
}) {
  const { setCurrentUser } = useContext(UserContext);
  const [resLoading, setResLoading] = useState<boolean>(false);
  const [resError, setResError] = useState<boolean>(false);

  useGoogleOneTapLogin({
    onSuccess: async ({ credential }) => {
      setResLoading(true);
      await fetch(`${SERVER_URI}/auth`, {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential,
        }),
      })
        .then(async (res) => setCurrentUser(await res.json()))
        .catch(() => setResError(true));
    }, 
    onError: () => setResError(true), 
  });

  const handleClickLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      setResLoading(true);
      await fetch(`${SERVER_URI}/auth`, {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
        }),
      })
        .then(async (res) => setCurrentUser(await res.json()))
        .catch(() => setResError(true));
    },
    flow: "auth-code",
    onError: () => setResError(true),
  });

  if (resLoading && !resError) return <Blank><Loader /></Blank>;
  else if (resError) return <Blank><FetchErrorMessage /></Blank>;

  return (
    <div className="grid place-items-center h-screen px-4">
      <div className="flex flex-col gap-7 items-center">
        <div className="flex gap-5 items-center justify-center flex-wrap">
          <img src={favicon} className="inline" />
          <p className="font-bold text-2xl inline">edamessage</p>
        </div>
        {isLoading && !isError && <Loader />}
        {isError && <FetchErrorMessage />}
        {!isLoading && !isError && (
          <button
            className="flex items-center gap-3 rounded-md border-2 py-3 px-5 border-slate transition-colors hover:bg-slate-100"
            onClick={() => handleClickLogin()}
          >
            <GoogleIcon className="scale-150" />
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
}
