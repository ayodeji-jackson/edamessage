import { CredentialResponse, GoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import { useContext, useEffect } from "react";
import favicon from '../assets/favicon.png';
import { UserContext } from "../context";

export default function Login() {
  const { user, setUser } = useContext(UserContext);

  const login = async (googleRes: CredentialResponse) => {
    await fetch(`${import.meta.env.VITE_SERVER_URI}/auth`, {
      method: 'POST', 
      credentials: 'include', 
      mode: 'cors', 
      body: JSON.stringify({
        token: googleRes.credential
      }), 
      headers: { 'Content-Type': 'application/json' }
    }).then(async res => setUser(await res.json()));
  };

  useGoogleOneTapLogin({
    onSuccess: login, onError: console.log
  });

  return (
    <div className="grid place-items-center h-screen">
      <div className="space-x-5">
        <img src={favicon} className="inline" />
        <p className="font-bold text-xl inline">edamessage</p>
      </div>
      <GoogleLogin size="medium"
       onSuccess={login} onError={console.log} />
    </div>
  );
};