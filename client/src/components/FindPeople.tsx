import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../types";

export default function FindPeople() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URI}/api/users`, {
      mode: "cors",
      credentials: "include"
    })
      .then(async res => {
        switch (res.status) {
          case 401:
            navigate("/");
          case 200:
            setUsers(await res.json());
        }
      });
  }, []);

  return (
    <div className="p-3 flex flex-col">
      <header className="flex items-center gap-6">
        <button onClick={() => navigate(-1)} className="text-2xl">✕</button>
        <h1 className="">New Conversation</h1>
      </header>
      <input type="search" placeholder="Search edamessage by name or email"
        value={searchPhrase}
        onChange={e => setSearchPhrase(e.target.value)}
        className="text-xs p-2 bg-custom-grey-200 rounded-lg pr-3 my-3"
      />
      <hr />
      <h2 className="text-sm my-3">New on edamessage</h2>
      <ul className="mt-5 space-y-1">
        { users.map(user => (
          <li key={ user.id }>
            <Link to={ `/u/${user.id}` }
              className="flex rounded-lg gap-5 p-2 h-16 items-center hover:bg-gray-200 transition-colors"
            >
              <img src={ user.picture } alt={ user.name } referrerPolicy="no-referrer"
                className="rounded-full h-full"
              />
              <p className="">{ user.name }</p>
            </Link>
          </li>
        )) }
      </ul>
    </div>
  );
}