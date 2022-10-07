import Home from "./components/Home";
import Login from "./components/Login";
import FindPeople from "./components/FindPeople";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SelectedConvo, UserContext } from "./context";
import { useEffect, useState } from "react";
import { User } from "./types";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Conversation from "./components/Conversation";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [recipient, setRecipient] = useState<User | null>(null);

  // useEffect(() => {
  //   console.log(user);
  // }, [user]);

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ user, setUser }}>
        <SelectedConvo.Provider value={{ recipient, setRecipient }}>
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
        </SelectedConvo.Provider>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
