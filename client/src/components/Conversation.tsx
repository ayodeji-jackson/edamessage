import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, SendIcon } from "../assets/icons";
import { UserContext } from "../contexts";
import { Convo, Message, User } from "../types";
import { socket } from "../App";
import Loader from "./Loader";
import FetchErrorMessage from "./FetchErrorMessage";

export default function Conversation() {
  const { currentUser } = useContext(UserContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const { recipientId } = useParams();
  const [recipient, setRecipient] = useState<User | null>(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");
  const dummy = useRef<HTMLDivElement | null>(null);
  const [pageIsLoading, setPageIsLoading] = useState<boolean>(true);
  const [pageIsError, setPageIsError] = useState<boolean>(false);
  const [messagesIsLoading, setMessagesIsLoading] = useState<boolean>(true);
  const [messagesIsError, setMessagesIsError] = useState<boolean>(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URI}/api/users/${recipientId}`, {
      credentials: "include",
      mode: "cors",
    })
      .then(async (res) => {
        switch (res.status) {
          case 200:
            setRecipient(await res.json());
            setPageIsLoading(false);
            break;
          case 401:
            navigate("/");
        }
      })
      .catch(() => setPageIsError(true));

    fetch(`${import.meta.env.VITE_SERVER_URI}/api/users/${recipientId}/convo`, {
      credentials: "include",
      mode: "cors",
    })
      .then(async (res) => {
        switch (res.status) {
          case 200:
            const response: Convo = await res.json();
            setMessages(response.messages || []);
            setMessagesIsLoading(false);
            break;
          case 401:
            navigate("/");
        }
      })
      .catch(() => setMessagesIsError(true));

    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: "smooth", block: "end" });

    socket.on("message", (inMessage: Message) => {
      if (recipientId === inMessage.senderId) {
        setMessages([...messages, inMessage]);
        // hitting the endpoint again to update message `readBy`
        fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/users/${recipientId}/convo`,
          {
            credentials: "include",
            mode: "cors",
            headers: {
              "No-Content": "true",
            },
          }
        );
      }
    });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const messageData: Message = {
        text: message.trim(),
        senderId: currentUser?.id!,
        recipientId,
        timestamp: new Date(),
      };
      setMessages([...messages, messageData]);
      socket.emit("message", messageData);
      setMessage("");
    }
  };

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  if (pageIsLoading && !pageIsError)
    return (
      <div className="grid place-items-center h-screen">
        <Loader />
      </div>
    );
  if (pageIsError)
    return (
      <div className="grid place-items-center h-screen">
        <FetchErrorMessage />
      </div>
    );
  if (!pageIsLoading && !pageIsError)
    return (
      <>
        <header className="flex py-4 pl-1 pr-7 bg-white items-center border-b-custom-grey-200 border-b-2 w-full">
          <button
            className="grey-on-hover rounded-full p-1"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <span className="flex gap-4 items-center">
            <img
              className="rounded-full w-12 h-12"
              src={recipient?.picture}
              alt={recipient?.name}
              referrerPolicy="no-referrer"
            />
            <p className="font-bold">{recipient?.name}</p>
          </span>
        </header>
        {messagesIsLoading && !messagesIsError && (
          <div className="h-[calc(100vh_-_9rem)] grid place-items-center">
            <Loader />
          </div>
        )}
        {messagesIsError && (
          <div className="h-[calc(100vh_-_9rem)] grid place-items-center">
            <FetchErrorMessage />
          </div>
        )}
        {!messagesIsLoading && !messagesIsError && (
          <div className="h-[calc(100vh_-_9rem)] p-3 pb-0 overflow-y-auto">
            {messages.map((message, i) => (
              <>
                <div
                  className={`${
                    message.senderId === currentUser?.id && "ml-auto"
                  }`}
                ></div>
                <div
                  className={`text-sm px-4 break-words py-2 w-fit max-w-[90%] rounded-b-3xl ${
                    message.senderId === currentUser?.id
                      ? "rounded-tl-3xl bg-custom-orange ml-auto text-white"
                      : "rounded-tr-3xl border-slate-300 border-2"
                  } ${
                    messages[i + 1]?.senderId === message.senderId
                      ? "mb-[2px]"
                      : "mb-5"
                  }`}
                  key={message.id || i}
                >
                  {message.text}
                </div>
              </>
            ))}
            <div ref={dummy}></div>
          </div>
        )}
        <form
          className="w-full p-3 pt-0 flex items-center gap-4 bg-white"
          onSubmit={handleSend}
        >
          <input
            placeholder="Type a message"
            value={message}
            disabled={messagesIsLoading}
            onChange={(e) => setMessage(e.target.value)}
            className="rounded-full py-4 px-6 text-xs border-slate-300 border w-full resize-none"
          />
          <button
            type="submit"
            aria-label="send"
            className="bg-custom-orange-100 rounded-full p-4"
          >
            <SendIcon className="scale-110 -rotate-45" />
          </button>
        </form>
      </>
    );
}
