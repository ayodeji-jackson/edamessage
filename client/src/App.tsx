import Home from "./components/Home";
import Login from "./components/Login";
import FindPeople from "./components/FindPeople";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserContext } from "./contexts";
import { useEffect, useState } from "react";
import { User } from "./types";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Conversation from "./components/Conversation";
import io from "socket.io-client";

export const socket = io(import.meta.env.VITE_SERVER_URI, { autoConnect: false });

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      socket.auth = { userId: user?.id };
      socket.connect();
    }
  }, [user]);

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ user, setUser }}>
        <GoogleOAuthProvider
          clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
        >
          <Routes>
            <Route path="/"
              element={user ? <Home /> : <Login />}
            />
            <Route path="/new"
              element={<FindPeople />}
            />
            <Route path="/u/:id"
              element={<Conversation />}
            />
          </Routes>
        </GoogleOAuthProvider>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
