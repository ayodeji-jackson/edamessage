import { Link } from "react-router-dom";
import { FetchErrorIcon } from "../assets/icons";

export default function FetchErrorMessage() {
  return (
    <p className="grid place-items-center gap-2 text-sm">
      <FetchErrorIcon className="w-10 " />
      <span>
        Failed to fetch.{" "}
        <Link to="/" className="text-custom-orange">
          Try again
        </Link>
      </span>
    </p>
  );
}
