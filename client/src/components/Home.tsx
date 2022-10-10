import { useContext } from "react";
import { Link } from "react-router-dom";
import { GearIcon, PlusIcon, AngleIcon, PencilIcon, StarIcon, SearchIcon } from "../assets/icons";
import { UserContext } from "../contexts";

export default function Home() {
  const { user } = useContext(UserContext);

  return (
    <>
      <header className="flex py-7 px-4 bg-custom-grey-200 items-center">
        <img className="rounded-full w-12" src={user?.picture} alt={user?.name} referrerPolicy="no-referrer" />
        <div className="ml-auto flex gap-5">
          <Link to="/" className="text-white bg-custom-orange h-8 w-8 grid place-items-center rounded-full">
            <PlusIcon className="scale-150" />
          </Link>
          <button className="text-custom-orange h-8 w-8 rounded-full border-2 border-solid border-current grid place-items-center">
            <GearIcon className="scale-150" />
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
            <Link to="/new"><PencilIcon className="w-7 h-7" /></Link>
            <button><StarIcon className="w-7 h-7" /></button>
          </span>
        </span>
        <label className="relative block">
          <span className="sr-only">Search</span>
          <span className="absolute inset-y-0 left-0 flex items-center pl-4">
            <SearchIcon className="h-7 w-7 opacity-50" />
          </span>
          <input className="my-6 placeholder:italic block bg-custom-grey-200 w-full rounded-xl py-4 pl-14 pr-3 text-sm" placeholder="Search here..." type="search" name="search" />
        </label>
      </main>
    </>
  );
}
