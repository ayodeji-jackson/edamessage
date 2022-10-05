import Home from "./components/Home";
import Login from "./components/Login";
import NewConversation from "./components/NewConversation";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserContext } from "./context";
import { useEffect, useState } from "react";
import { User } from "./types";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <BrowserRouter>
      <UserContext.Provider value={user}>
        <GoogleOAuthProvider
          clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
        >
          <Routes>
            <Route path="/" 
              element={ user ? <Home /> : <Login handleLogin={ setUser } /> } 
            />
            <Route path="/new" 
              element={ <NewConversation /> } 
            />
          </Routes>
        </GoogleOAuthProvider>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
