import { useEffect, useState } from "react";
import { User } from "../types";

export default function NewConversation() {
  const [ users, setUsers ] = useState<User[]>([]);
  const [ searchPhrase, setSearchPhrase ] = useState<string>('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URI}/users`)
      .then(async res => setUsers(await res.json()));
  }, []);

  return (
    <div className="p-3 flex flex-col">
      <header className="flex items-center gap-6">
        <button className="text-2xl">✕</button>
        <h1 className="">New Conversation</h1>
      </header>
      <input type="search" placeholder="Search edamessage by name or email"
        value={ searchPhrase } 
        onChange={ e => setSearchPhrase(e.target.value) }
        className="text-xs p-2 bg-custom-grey-200 rounded-lg pr-3 my-3"
      />
      <hr />
      <h2 className="text-sm my-3">New on edamessage</h2>
    </div>
  );
}