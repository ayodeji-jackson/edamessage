import { useGoogleOneTapLogin } from "@react-oauth/google";
import { User } from "../types";
import favicon from '../assets/favicon.png';
import { useNavigate } from "react-router-dom";

export default function Login({ handleLogin }: { handleLogin: (user: User) => void; }) {
  const navigate = useNavigate();
  
  useGoogleOneTapLogin({
    onSuccess: async googleRes => {
      await fetch(`${import.meta.env.VITE_SERVER_URI}/auth`, {
        method: 'POST', 
        body: JSON.stringify({
          token: googleRes.credential
        }), 
        headers: { 'Content-Type': 'application/json' }
      }).then(async res => handleLogin(await res.json()));
    }, onError: () => console.log('failed')
  });

  return (
    <div className="grid place-items-center h-screen">
      <div className="space-x-5">
        <img src={favicon} className="inline" />
        <p className="font-bold text-xl inline">edamessage</p>
      </div>
    </div>
  );
};