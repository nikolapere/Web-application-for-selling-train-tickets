import React, { useEffect, useState } from 'react';
import { updateDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import TicketConfirmationModal from './TicketConfirmationModal';

function TicketConfirmationDialog({ journey, date, onConfirm }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleConfirm = async () => {
    const userEmail = currentUser.email;

    const userRef = collection(db, 'users');
    const q = query(userRef, where('email', '==', userEmail));

    try {
      const querySnapshot = await getDocs(q);
      const userDoc = querySnapshot.docs[0];

      if (!userDoc) {
        console.log('Nema podataka o korisniku u Firestore-u.');
        return;
      }

      const ticketPrice = journey.price;
      const currentBalance = userDoc.data().accountBalance;

      if (currentBalance < ticketPrice) {
        alert('Nemate dovoljno sredstava za kupovinu karte.');
        return;
      }

      const updatedBalance = currentBalance - ticketPrice;
      await updateDoc(userDoc.ref, { accountBalance: updatedBalance });

      console.log('Uspesno smanjena suma na računu.');

      const userTicketsRef = collection(db, 'userTickets');
      await addDoc(userTicketsRef, {
        userId: userDoc.id,
        journeyDetails: {
          startStation: journey.startStation,
          endStation: journey.endStation,
          startTime: journey.departureTime,
          endTime: journey.arrivalTime,
          trainType: journey.trainType,
          price: journey.price,
        },
        date,
        generatedAt: new Date(),
      });

      // Prikaz modala
      setShowModal(true);
    } catch (error) {
      console.error('Greška prilikom dohvatanja podataka korisnika:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    onConfirm(); // Zatvaranje modala
  };

  return (
    <div className="container mt-5">
      <h2>Detalji rezervacije</h2>
      <p>Detalji vožnje:</p>
      <p>Polazak: {journey.startStation} ({journey.departureTime})</p>
      <p>Dolazak: {journey.endStation} ({journey.arrivalTime})</p>
      <p>Tip voza: {journey.trainType}</p>
      <p>Cena: {journey.price} RSD</p>
      <p>Datum: {date}</p>
      <div className="button-container">
        <button className="btn btn-primary" onClick={handleConfirm}>
          Potvrdi rezervaciju
        </button>
      </div>

      <TicketConfirmationModal isOpen={showModal} onClose={handleCloseModal} />
    </div>
  );
}

export default TicketConfirmationDialog;
