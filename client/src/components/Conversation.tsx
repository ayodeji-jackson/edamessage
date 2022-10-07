import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, SendIcon } from "../assets/icons";
import { SelectedConvo } from "../context";
import { User } from "../types";

export default function Conversation() {
  const { recipient } = useContext(SelectedConvo);
  const [ convo, setConvo ] = useState<User | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (recipient) {
      setConvo(recipient);
    } else {
      fetch(`${import.meta.env.VITE_SERVER_URI}/users/${id}/convo`, {
        credentials: 'include', 
        mode: 'cors'
      }).then(async res => {
        switch(res.status) {
          case 200: 
            setConvo(await res.json());
          case 401: 
            navigate("/");
        }
      })
    }
  }, []);

  return (
    <>
      <header className="flex py-4 pl-1 pr-7 bg-white items-center border-b-custom-grey-200 border-b-2 fixed w-full">
        <button onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <span className="flex gap-4 items-center">
          <img className="rounded-full w-12 h-12" src={convo?.picture} alt={convo?.name} referrerPolicy="no-referrer" />
          <p className="font-bold">{ convo?.name }</p>
        </span>
      </header>
      <div></div>
      <div className="fixed bottom-0 w-full p-5 flex items-center gap-4">
        <input type="text" placeholder="Type a message" className="rounded-full py-4 px-6 text-xs border-slate-300 border w-full" />
        <button aria-label="send" className="bg-custom-orange-100 rounded-full p-4">
          <SendIcon className="fill-custom-orange -rotate-45" />
        </button>
      </div>
    </>
  );
}