import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GearIcon,
  PlusIcon,
  AngleIcon,
  PencilIcon,
  StarIcon,
  SearchIcon,
} from "../assets/icons";
import { UserContext } from "../contexts";
import { Convo, Message } from "../types";
import { SERVER_URI, socket } from "../App";
import Loader from "./Loader";
import FetchErrorMessage from "./FetchErrorMessage";
import { formatDateTimeFromNow } from "../utils";

export default function Home() {
  const { currentUser } = useContext(UserContext);
  const [convos, setConvos] = useState<Convo[]>([]);
  const [convosLoading, setConvosLoading] = useState<boolean>(true);
  const [convosError, setConvosError] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${SERVER_URI}/convos`, {
      credentials: "include",
      mode: "cors",
    })
      .then(async (res) => {
        switch (res.status) {
          case 200:
            setConvos(await res.json());
            setConvosLoading(false);
            break;
          case 401:
            navigate("/");
        }
      })
      .catch(() => setConvosError(true));

    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    socket.on("message", (message: Message) => {
      // show new messages on home screen in real time
      const convosCopy = convos.slice(0);

      if (convosCopy.find((convo) => convo.id === message.convo?.id)) {
        convosCopy
          .find((convo) => convo.id === message.convo?.id)
          ?.messages.push(message);
        setConvos(convosCopy);
      } else setConvos([...convos, message.convo!]);
    });
  }, [convos]);

  return (
    <>
      <header className="flex py-7 px-4 bg-custom-grey-200 items-center">
        <img
          className="rounded-full w-12"
          src={currentUser?.picture}
          alt={currentUser?.name}
          referrerPolicy="no-referrer"
        />
        <div className="ml-auto flex gap-5">
          <button
            disabled
            className="text-white bg-custom-orange h-7 w-7 grid place-items-center rounded-full"
          >
            <PlusIcon className="scale-110" />
          </button>
          <button
            disabled
            className="text-custom-orange h-7 w-7 rounded-full border-2 border-solid border-current grid place-items-center"
          >
            <GearIcon className="scale-110" />
          </button>
        </div>
      </header>
      <main className="flex px-4 py-7 flex-col border-t-2">
        <span className="flex gap-3 items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-custom-orange-300 to-custom-orange-200 bg-clip-text [-webkit-text-fill-color:transparent]">
            Messages
          </h1>
          <button disabled>
            <AngleIcon className="inline w-4 h-4" />
          </button>
          <span className="ml-auto text-custom-grey-100 flex gap-6">
            <Link to="/new" className="grey-on-hover rounded-full p-1">
              <PencilIcon className="w-6 h-6" />
            </Link>
            <button disabled>
              <StarIcon className="w-6 h-6" />
            </button>
          </span>
        </span>
        <label className="relative block">
          <span className="sr-only">Search</span>
          <span className="absolute inset-y-0 left-0 flex items-center pl-4">
            <SearchIcon className="h-7 w-7 opacity-50" />
          </span>
          <input
            className="my-6 placeholder:italic block bg-custom-grey-200 w-full rounded-xl py-4 pl-14 pr-3 text-sm"
            placeholder="Search here..."
            disabled
            type="search"
            name="search"
          />
        </label>
        {convosLoading && !convosError && <Loader />}
        {convosError && <FetchErrorMessage />}
        <div className="space-y-1">
          {!convosLoading && !convosError && !convos.length ? (
            <p className="text-center">
              Tap <PencilIcon className="inline" /> at the top to start a
              conversation
            </p>
          ) : (
            convos.map((convo) => {
              const recipient = convo.isGroup
                ? convo
                : convo.parties.filter(
                    (party) => party.id !== currentUser?.id
                  )[0];
              return (
                <div key={convo.id}>
                  <Link
                    to={
                      !convo.isGroup
                        ? `/u/${recipient.id}`
                        : `/g/${recipient.id}`
                    }
                    className="conversations-list-item"
                  >
                    <img
                      src={recipient.picture}
                      alt={recipient.name}
                      referrerPolicy="no-referrer"
                      className="rounded-full h-full"
                    />
                    <div className="grid grid-rows-2 gap-2">
                      <p className="font-bold text-lg constrain-ellipsis">
                        {recipient.name}
                      </p>
                      <p className="text-sm constrain-ellipsis">
                        {convo.messages[convo.messages.length - 1].senderId ===
                          currentUser?.id && "You: "}
                        {convo.messages[convo.messages.length - 1].text}
                      </p>
                    </div>
                    <div className="text-xs grid grid-rows-2 place-items-center gap-2 ml-auto mr-5 items-end">
                      <span className="block text-gray-600">
                        {formatDateTimeFromNow(
                          new Date(
                            convo.messages[convo.messages.length - 1].timestamp
                          )
                        )}
                      </span>
                      {!convo.messages[
                        convo.messages.length - 1
                      ].readByIds?.includes(currentUser?.id!) && (
                        <span className="text-white bg-custom-orange rounded-full px-2 py-1 w-fit">
                          {
                            convo.messages.filter(
                              (msg) =>
                                !msg.readByIds?.includes(currentUser?.id!)
                            ).length
                          }
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </main>
    </>
  );
}
