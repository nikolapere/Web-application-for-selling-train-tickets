import React, { useState, useEffect } from "react";
import "./App.css";
import RegistrationForm from "./RegistrationForm";
import Login from "./Login";
import UserProfile from "./UserProfile";
import AdminDashboard from "./AdminDashboard";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ContactForm from "./ContactForm";
import "./global.css"



function App() {
  const [isAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <div>
        {!isAuthenticated ? (
          <>
            <Login />
            <h3>Nemate profil? Registrujte se besplatno!</h3>
            <RegistrationForm />
          </>
        ) : (
          <>
            {isAdmin ? (
              <AdminDashboard />
            ) : (
              <UserProfile />
            )}
          </>
        )}
      </div>
      <footer className="bg-light p-4 footer">
        <div className="cotainer">
        <h4>Kontaktirajte nas :</h4>
        <ContactForm />
        <p className="copyright">  Nikola Perehinac &copy; - završni rad 2023</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
