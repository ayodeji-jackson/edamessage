import { useContext } from "react";
import { Link } from "react-router-dom";
import { GearIcon, PlusIcon, AngleIcon, PencilIcon, StarIcon, SearchIcon, PersonIcon } from "../assets/icons";
import { UserContext } from "../context";

export default function Home() {
  const { user } = useContext(UserContext);

  return (
    <>
      <header className="flex py-7 px-12 bg-custom-grey-200 items-center">
        <span className="rounded-[50%] w-12 bg-white grid place-items-center">
          {user?.picture ? <img className="rounded-[50%]" src={user.picture} alt={user.name} referrerPolicy="no-referrer" /> :
            <PersonIcon />}
        </span>
        <div className="ml-auto flex gap-5">
          <Link to="/" className="text-white bg-custom-orange h-8 w-8 relative rounded-[50%]">
            <PlusIcon className="scale-150 absolute -translate-x-[50%] -translate-y-[50%] left-[50%] top-[50%]" />
          </Link>
          <button className="text-custom-orange h-8 w-8 relative rounded-[50%] border-2 border-solid border-current">
            <GearIcon className="scale-150 absolute -translate-x-[50%] -translate-y-[50%] left-[50%] top-[50%]" />
          </button>
        </div>
      </header>
      <main className="flex px-10 py-7 flex-col border-t-2 pr-12">
        <span className="flex gap-3 items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-custom-orange-200 to-custom-orange-100 bg-clip-text [-webkit-text-fill-color:transparent]">
            Messages
          </h1>
          <button><AngleIcon className="inline w-4 h-4" /></button>
          <span className="ml-auto text-custom-grey-100 flex gap-6 pr-2">
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
