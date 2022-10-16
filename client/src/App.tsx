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

export const socket = io(import.meta.env.VITE_SERVER_URI, {
  autoConnect: false,
});

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (currentUser) {
      socket.auth = { userId: currentUser?.id };
      socket.connect();
    }
  }, [currentUser]);

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ currentUser, setCurrentUser }}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <Routes>
            <Route path="/" element={currentUser ? <Home /> : <Login />} />
            <Route path="/new" element={<FindPeople />} />
            <Route path="/u/:recipientId" element={<Conversation />} />
          </Routes>
        </GoogleOAuthProvider>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
