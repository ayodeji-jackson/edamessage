import { createContext } from "react";
import { User } from "./types";

export const UserContext = createContext({
  user: <User | null>null, setUser: (val: User) => {}
});

export const SelectedConvo = createContext({
  recipient: <User | null>null, setRecipient: (val: User) => {}
})