import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, SendIcon } from "../assets/icons";
import { UserContext } from "../contexts";
import { Message, User } from "../types";
import io from "socket.io-client";

const socket = io(`${import.meta.env.VITE_SERVER_URI}`);

export default function Conversation() {
  const { user } = useContext(UserContext);
  const [convo, setConvo] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const dummy = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URI}/api/users/${id}/convo`, {
      credentials: 'include',
      mode: 'cors'
    }).then(async res => {
      switch (res.status) {
        case 200:
          setConvo(await res.json());
          break;
        case 401:
          navigate("/");
      }
    });
  }, []);

  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: "smooth", block: 'end' });
  }, [messages])

  socket.on('message', (message: Message) => {
    setMessages([...messages, message]);
  });

  const sendMessage = () => {
    if (message.trim()) {
      const messageData: Message = {
        text: message.trim(),
        senderId: user?.id!, 
        recipientId: id!, 
        convoId: convo?.id, 
        timestamp: new Date()
      };
      setMessages([...messages, messageData]);
      socket.emit("message", messageData);
      setMessage('');
    }
  };

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <>
      <header className="flex py-4 pl-1 pr-7 bg-white items-center border-b-custom-grey-200 border-b-2 w-full">
        <button onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <span className="flex gap-4 items-center">
          <img className="rounded-full w-12 h-12" src={convo?.picture} alt={convo?.name} referrerPolicy="no-referrer" />
          <p className="font-bold">{convo?.name}</p>
        </span>
      </header>
      <div className="h-[calc(100vh_-_9rem)] p-3 pb-0 overflow-y-auto">
        {
          messages.map((message, i, arr) => (
            <div className={`text-sm px-4 break-words py-2 w-fit max-w-[90%] rounded-b-3xl ${message.senderId === user?.id ? 'rounded-tl-3xl bg-custom-orange ml-auto text-white' : 'rounded-tr-3xl border-slate-300 border-2'} ${arr[i + 1]?.senderId === message.senderId ? 'mb-[2px]' : 'mb-5'}`} key={i}>{message.text}</div>
          ))
        }
        <div ref={ dummy }></div>
      </div>
      <form className="w-full p-3 pt-0 flex items-center gap-4 bg-white" onSubmit={handleSend}>
        <input placeholder="Type a message" value={message} onChange={e => setMessage(e.target.value)}
          onKeyUp={e => e.key === 'Enter' && !e.ctrlKey ? sendMessage() : true}
          className="rounded-full py-4 px-6 text-xs border-slate-300 border w-full resize-none"
        />
        <button type="submit" aria-label="send" className="bg-custom-orange-100 rounded-full p-4">
          <SendIcon svgProps={{ className: "scale-110 -rotate-45" }}
            pathProps={{ className: "" }}
          />
        </button>
      </form>
    </>
  );
}