import { createContext } from "react";
import { User } from "./types";

export const UserContext = createContext({
  currentUser: <User | null>null,
  setCurrentUser: (val: User) => {},
});
