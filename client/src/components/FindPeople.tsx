import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SERVER_URI } from "../App";
import { User } from "../types";
import FetchErrorMessage from "./FetchErrorMessage";
import Loader from "./Loader";

export default function FindPeople() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [peopleLoading, setPeopleLoading] = useState<boolean>(true);
  const [peopleError, setPeopleError] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${SERVER_URI}/users`, {
      mode: "cors",
      credentials: "include",
    }).then(async (res) => {
      switch (res.status) {
        case 200:
          setUsers(await res.json());
          setPeopleLoading(false);
          break;
        case 401:
          navigate("/");
      }
    }).catch(() => setPeopleError(true));
  }, []);

  return (
    <div className="p-4 flex flex-col">
      <header className="flex items-center gap-6">
        <button
          onClick={() => navigate(-1)}
          className="text-2xl leading-none h-8 w-8 rounded-full grey-on-hover"
        >
          ✕
        </button>
        <h1 className="">New Conversation</h1>
      </header>
      <input
        type="search"
        placeholder="Search edamessage by name or email"
        value={searchPhrase} disabled
        onChange={(e) => setSearchPhrase(e.target.value)}
        className="text-sm p-3 bg-custom-grey-200 rounded-lg my-3"
      />
      <hr className="mb-3" />
      <h2 className="text-sm mb-3">New on edamessage</h2>
      {peopleLoading && !peopleError && <Loader />}
      {peopleError && <FetchErrorMessage />}
      {!peopleLoading && !peopleError && (
        <ul className="space-y-1">
          {users.map((user) => (
            <li key={user.id}>
              <Link to={`/u/${user.id}`} className="conversations-list-item">
                <img
                  src={user.picture}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="rounded-full h-full"
                />
                <p className="">{user.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
