import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import { useContext } from "react";
import favicon from '../assets/favicon.png';
import { GoogleIcon } from "../assets/icons";
import { UserContext } from "../context";

export default function Login() {
  const { setUser } = useContext(UserContext);

  useGoogleOneTapLogin({ 
    onSuccess: async ({ credential }) => {
      await fetch(`${import.meta.env.VITE_SERVER_URI}/api/auth`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({
          credential
        })
      }).then(async res => setUser(await res.json()));
    }
  });

  const handleClickLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      await fetch(`${import.meta.env.VITE_SERVER_URI}/api/auth`, {
        method: 'POST', 
        credentials: 'include', 
        mode: 'cors', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({
          code
        })
      }).then(async res => setUser(await res.json()));
    },
    flow: 'auth-code'
  });

  return (
    <div className="grid place-items-center h-screen">
      <div className="space-y-7">
        <div className="space-x-5">
          <img src={favicon} className="inline" />
          <p className="font-bold text-xl inline">edamessage</p>
        </div>
        <button className="flex items-center gap-3 rounded-md border-2 py-3 px-5 border-slate transition-colors hover:bg-slate-100"
          onClick={ () => handleClickLogin() }
        >
          <GoogleIcon className="scale-150" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};