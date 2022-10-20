import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import favicon from "../assets/favicon.png";
import { GoogleIcon } from "../assets/icons";
import { UserContext } from "../contexts";
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
  const [localIsLoading, setLocalIsLoading] = useState<boolean>(false);
  const [localIsError, setLocalIsError] = useState<boolean>(false);

  useEffect(() => {
    return () => setLocalIsLoading(false);
  }, []);

  useGoogleOneTapLogin({
    onSuccess: async ({ credential }) => {
      setLocalIsLoading(true);
      await fetch(`${import.meta.env.VITE_SERVER_URI}/api/auth`, {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential,
        }),
      })
        .then(async (res) => setCurrentUser(await res.json()))
        .catch(() => setLocalIsError(true));
    },
  });

  const handleClickLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      setLocalIsLoading(true);
      await fetch(`${import.meta.env.VITE_SERVER_URI}/api/auth`, {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
        }),
      })
        .then(async (res) => setCurrentUser(await res.json()))
        .catch(() => setLocalIsError(true));
    },
    flow: "auth-code",
  });

  return (
    <div className="grid place-items-center h-screen">
      {localIsLoading && !localIsError && <Loader />}
      {localIsError && <FetchErrorMessage />}
      {!localIsLoading && !localIsError && (
        <div className="flex flex-col gap-7 items-center">
          <div className="space-x-5">
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
      )}
    </div>
  );
}
