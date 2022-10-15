import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GearIcon, PlusIcon, AngleIcon, PencilIcon, StarIcon, SearchIcon } from "../assets/icons";
import { UserContext } from "../contexts";
import { Convo, Message } from "../types";
import { socket } from '../App';

export default function Home() {
  const { user } = useContext(UserContext);
  const [ convos, setConvos ] = useState<Convo[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URI}/api/convos`, {
      credentials: 'include', 
      mode: 'cors', 
    }).then(async res => setConvos(await res.json()));

    socket.on("message", (message: Message) => {
      // show new messages on home screen in real time
      const changeConvo = convos.find(
        convo => [message.senderId, message.recipientId].every(val => convo.partiesIds.includes(val!))
      );
  
      if (changeConvo) {
        changeConvo.messages.push(message);
        setConvos([ ...convos, changeConvo ]);
      } else {
        fetch(`${import.meta.env.VITE_SERVER_URI}/api/users/${message.recipientId}/convo`, {
          credentials: 'include', 
          mode: 'cors',
        }).then(async res => setConvos([...convos, await res.json()]))
      }
      
    });
  }, []);
  
  

  return (
    <>
      <header className="flex py-7 px-4 bg-custom-grey-200 items-center">
        <img className="rounded-full w-12" src={user?.picture} alt={user?.name} referrerPolicy="no-referrer" />
        <div className="ml-auto flex gap-5">
          <Link to="/" className="text-white bg-custom-orange h-7 w-7 grid place-items-center rounded-full">
            <PlusIcon className="scale-110" />
          </Link>
          <button className="text-custom-orange h-7 w-7 rounded-full border-2 border-solid border-current grid place-items-center">
            <GearIcon className="scale-110" />
          </button>
        </div>
      </header>
      <main className="flex px-4 py-7 flex-col border-t-2">
        <span className="flex gap-3 items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-custom-orange-300 to-custom-orange-200 bg-clip-text [-webkit-text-fill-color:transparent]">
            Messages
          </h1>
          <button><AngleIcon className="inline w-4 h-4" /></button>
          <span className="ml-auto text-custom-grey-100 flex gap-6">
            <Link to="/new"><PencilIcon className="w-6 h-6" /></Link>
            <button><StarIcon className="w-6 h-6" /></button>
          </span>
        </span>
        <label className="relative block">
          <span className="sr-only">Search</span>
          <span className="absolute inset-y-0 left-0 flex items-center pl-4">
            <SearchIcon className="h-7 w-7 opacity-50" />
          </span>
          <input className="my-6 placeholder:italic block bg-custom-grey-200 w-full rounded-xl py-4 pl-14 pr-3 text-sm" placeholder="Search here..." type="search" name="search" />
        </label>
        <div className="space-y-1">
          {
            !convos.length ? <p className="text-center">Tap <PencilIcon className="inline" /> at the top to start a conversation</p> : 
            convos.map(convo => {
              const recipient = convo.isGroup ? convo : convo.parties.filter(party => party.id !== user?.id)[0];
              return (
                <div key={ convo.id }>
                  <Link to={!convo.isGroup ? `/u/${recipient.id}` : `/g/${recipient.id}`} className="conversations-list-item">
                    <img src={ recipient.picture } alt={ recipient.name }
                      referrerPolicy="no-referrer" className="rounded-full h-full"
                    />
                    <div className="flex gap-2 flex-col">
                      <p className="font-bold text-lg">{ recipient.name }</p>
                      <p className="text-sm">
                        { convo.messages[convo.messages.length - 1].senderId === user?.id && 'You: ' }
                        { convo.messages[convo.messages.length - 1].text }
                      </p>
                    </div>
                    <div className="text-xs flex gap-2 flex-col ml-auto mr-5 items-end">
                      <span className="block text-gray-600">{  }</span>
                      { <span className="text-white bg-custom-orange rounded-full px-2 py-1 w-fit">{  }</span> }
                    </div>
                  </Link>
                </div>
              )
            })
          }
        </div>
      </main>
    </>
  );
}
