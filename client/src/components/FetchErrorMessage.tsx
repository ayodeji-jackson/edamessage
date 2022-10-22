import { FetchErrorIcon, ReloadIcon } from "../assets/icons";

export default function FetchErrorMessage() {
  return (
    <div className="w-full flex justify-center">
      <p className="grid place-items-center gap-2 text-sm">
        <FetchErrorIcon className="w-10 " />
        <span>
          Looks like you lost your connection. Please check it and try again.
        </span>
        <button className="bg-custom-orange text-white py-2 px-4 rounded-full flex gap-3 place-items-center">
          <ReloadIcon /><span>Retry</span>
        </button>
      </p>
    </div>
  );
}
