import { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { GearIcon, PlusIcon, AngleIcon, PencilIcon, StarIcon, SearchIcon, PersonIcon } from "../assets/icons";
import { UserContext } from "../context";

export default function Home() {
  const searchContainer = useRef<HTMLSpanElement>(null);
  const user = useContext(UserContext);
  return (
    <>
      <header className="flex p-6 bg-custom-grey-200 items-center">
        <span className="rounded-[50%] h-9 w-9 bg-white grid place-items-center">
          {user?.picture ? <img className="rounded-[50%]" src={user.picture} alt={user.name} /> :
            <PersonIcon />}
        </span>
        <div className="ml-auto flex gap-3">
          <Link to="/login" className="text-white bg-custom-orange h-5 w-5 grid place-items-center rounded-[50%]">
            <PlusIcon className="scale-75" />
          </Link>
          <button className="text-custom-orange h-5 w-5 grid place-items-center rounded-[50%] border-2 border-solid border-current">
            <GearIcon className="scale-75" />
          </button>
        </div>
      </header>
      <main className="flex p-6 flex-col">
        <span className="flex gap-3 items-center">
          <h1 className="font-bold bg-gradient-to-r from-custom-orange-200 to-custom-orange-100 bg-clip-text [-webkit-text-fill-color:transparent]">
            Messages
          </h1>
          <button><AngleIcon className="inline w-4 h-4" /></button>
          <span className="ml-auto text-custom-grey-100 flex gap-3">
            <Link to="/new"><PencilIcon /></Link>
            <button><StarIcon /></button>
          </span>
        </span>
        <span className="h-10 flex my-6 items-stretch rounded-lg min-w-[6.5rem]" ref={ searchContainer }>
          <span className="px-3 bg-custom-grey-200 rounded-l-lg grid place-items-center"
            onClick={ e => ((e.currentTarget as HTMLElement).nextElementSibling as HTMLInputElement).focus() }
          >
            <SearchIcon className="text-custom-grey-100 h-5 w-5" />
          </span>
          <input type="search" placeholder="Search here..." 
            onFocus={ () => searchContainer.current!.style.outline = 'solid' } 
            onBlur={ () => searchContainer.current!.style.outline = 'none' }
            className="text-xs bg-custom-grey-200 rounded-r-lg flex-1 w-0 outline-none pr-3" />
        </span>
      </main>
    </>
  );
}
