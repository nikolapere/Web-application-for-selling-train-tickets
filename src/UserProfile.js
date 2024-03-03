import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import PaymentSlip from './PaymentSlip';
import StationAndDateSelection from './StationAndDateSelection';
import MyTickets from './MyTickets';
import "./global.css"


function UserProfile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
   // Stanje za keširanje podataka
   const [cachedUserData, setCachedUserData] = useState(null);
  const [showPaymentSlip, setShowPaymentSlip] = useState(false);
  const [pozivNaBroj, setPozivNaBroj] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Provera keširanih podataka pre nego sto se ponovo učitaju iz baze
        if (cachedUserData) {
          setUserData(cachedUserData);
        } else {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', currentUser.email));

          try {
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              const userData = querySnapshot.docs[0].data();
              setUserData(userData);
              // Keširanje podataka
              setCachedUserData(userData);
            } else {
              console.log('Nema podataka o korisniku u Firestore-u.');
            }
          } catch (error) {
            console.error('Greška prilikom dohvatanja podataka korisnika:', error);
          }
        }
      } else {
        setUser(null);
        setUserData(null); 
        setCachedUserData(null);
      }
    });

    return () => unsubscribe();
  }, [cachedUserData]); 

  const handleLogout = async () => {
    const auth = getAuth();

    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Greška prilikom odjave:', error);
    }
  };

  function generateUniqueReferenceNumber(phoneNumber, birthYear) {
    const pozivNaBroj = `${phoneNumber}${birthYear}`.padStart(6, '0');
    return pozivNaBroj;
  }

  const handleTogglePaymentSlip = () => {
    const phoneNumber = userData.phoneNumber.replace(/\D/g, '');
    const birthYear = userData.dob ? userData.dob.split('-')[0] : '';
    const pozivNaBroj = generateUniqueReferenceNumber(phoneNumber, birthYear);
    setPozivNaBroj(pozivNaBroj);
    setShowPaymentSlip((prevShow) => !prevShow);
  };

  return (
    <div className="container mt-4">
      {user ? (
        <div>
          {user.email === 'perehinac.nikola@gmail.com' ? (
            <div>
              <h2 className="mb-4">Korisnički profil</h2>
              <h4>Dobrodošli, administratoru!</h4>
              <div>
                <AdminDashboard />
              </div>
              <button className="btn btn-danger" onClick={handleLogout}>Odjava</button>
            </div>
          ) : (
            <div> 
              <h2 className="mb-4">Korisnički profil</h2>
              <p>Dobrodošli, {userData ? `${userData.ime} ${userData.prezime}` : 'Nema imena'}!</p>
              <p>E-mail: {user.email}</p>
              {userData && (
                <>
                  <p>Datum rođenja: {userData.dob}</p>
                  <p>Broj telefona: {userData.phoneNumber}</p>
                  <p>Stanje računa: {userData.accountBalance} RSD</p>
                </>
              )}
              <button className="btn btn-primary mr-2 button" onClick={handleTogglePaymentSlip}>Uputstvo za dopunu kredita</button>
              {showPaymentSlip && (
                <PaymentSlip
                  uplatilac={`${userData.ime} ${userData.prezime}`}
                  svrhaUplate="Dopuna kredita"
                  primalac="D. O. O. VOZ Beograd"
                  sifraPlacanja="189"
                  valuta="RSD"
                  iznos=" Ovde unesite iznos uplate "
                  racunPrimaoca="840-123456-15"
                  brojModela="97"
                  pozivNaBroj={pozivNaBroj}
                />
              )}
              <div className="mb-4">
                <StationAndDateSelection />
              </div>
              <div>
                <MyTickets />
              </div>
              <button className="btn btn-danger" onClick={handleLogout}>Odjava</button>
            </div>
          )}
        </div>
      ) : (
        <p>Morate biti prijavljeni da biste videli ovu stranicu.</p>
      )}
    </div>
  );
}

export default UserProfile;
