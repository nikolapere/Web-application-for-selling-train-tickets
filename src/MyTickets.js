import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from './firebase';
import trainLogo from './train-logo.png';

function MyTickets() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userTickets, setUserTickets] = useState([]);
  const [userName, setUserName] = useState('');
  const [userSurname, setUserSurname] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        fetchUserData(user);
        fetchUserTickets(user);
      } else {
        setCurrentUser(null);
        setUserTickets([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (user) => {
    const userEmail = user.email;

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', userEmail));

    try {
      const querySnapshot = await getDocs(q);
      const userData = querySnapshot.docs[0].data();
      setUserName(userData.ime);
      setUserSurname(userData.prezime);
    } catch (error) {
      console.error('Greška prilikom dohvatanja podataka korisnika:', error);
    }
  };

  const fetchUserTickets = async (user) => {
    const userEmail = user.email;

    const userRef = collection(db, 'users');
    const q = query(userRef, where('email', '==', userEmail));

    try {
      const querySnapshot = await getDocs(q);
      const userDoc = querySnapshot.docs[0];

      if (!userDoc) {
        console.log('Nema podataka o korisniku u Firestore-u.');
        return;
      }

      const userTicketsRef = collection(db, 'userTickets');
      const userTicketsQuery = query(userTicketsRef, where('userId', '==', userDoc.id));
      const userTicketsSnapshot = await getDocs(userTicketsQuery);
      const tickets = userTicketsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), userName, userSurname }));

      setUserTickets(tickets.sort((a, b) => b.generatedAt.seconds - a.generatedAt.seconds));
    } catch (error) {
      console.error('Greška prilikom dohvatanja podataka korisnika:', error);
    }
  };

  const generateQRCode = async (text) => {
    try {
      const canvas = await QRCode.toCanvas(text, { width: 100 });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Greška prilikom generisanja QR koda:', error);
      return null;
    }
  };

  const generatePDF = async (journeyDetails, date) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Vozna Karta', 70, 10);
    doc.line(10, 15, 200, 15);

    doc.setFontSize(12);
    doc.text(`Polazak: ${journeyDetails.startStation} (${journeyDetails.startTime})`, 10, 30);
    doc.text(`Dolazak: ${journeyDetails.endStation} (${journeyDetails.endTime})`, 10, 40);
    doc.text(`Tip voza: ${journeyDetails.trainType}`, 10, 50);
    doc.text(`Cena: ${journeyDetails.price}`, 10, 60);
    doc.text(`Datum: ${date}`, 10, 70);
    doc.text(`Putnik: ${userName} ${userSurname}`, 10, 80);

    // Generisanje QR koda
    const qrCodeText = `Karta za ${journeyDetails.startStation} - ${journeyDetails.endStation} (${date})`;
    const qrCodeDataURL = await generateQRCode(qrCodeText);
    if (qrCodeDataURL) {
      doc.addImage(qrCodeDataURL, 'PNG', 20, 100, 60, 60); // 20 - left, 100 - top, 60 - height, 60-width
    }

    // Logo
    const trainLogoDataURL = await fetch(trainLogo).then(res => res.blob()).then(blob => URL.createObjectURL(blob));
    doc.addImage(trainLogoDataURL, 'PNG', 115, 20, 75, 75);

    doc.save('karta.pdf');
  };

  const handleGeneratePDF = (journeyDetails, date) => {
    generatePDF(journeyDetails, date);
  };

  const handleDeleteTicket = async (ticketId) => {
    const ticketRef = doc(db, 'userTickets', ticketId);

    try {
      await deleteDoc(ticketRef);
      console.log('Karta uspešno obrisana.');
      fetchUserTickets(currentUser);
    } catch (error) {
      console.error('Greška prilikom brisanja karte:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Moje karte</h2>
      {userTickets.length === 0 ? (
        <p>Nemate kupljenih karata.</p>
      ) : (
        <ul className="list-group">
          {userTickets.map((ticket) => (
            <li key={ticket.id} className="list-group-item">
              <p>Datum i vreme kupovine: {new Date(ticket.generatedAt.seconds * 1000).toLocaleString()}</p>
              <p>Datum: {ticket.date}</p>
              <p>Polazak: {ticket.journeyDetails.startStation} ({ticket.journeyDetails.startTime})</p>
              <p>Dolazak: {ticket.journeyDetails.endStation} ({ticket.journeyDetails.endTime})</p>
              <p>Tip voza: {ticket.journeyDetails.trainType}</p>
              <p>Cena: {ticket.journeyDetails.price}</p>
              <button className="btn btn-primary" onClick={() => handleGeneratePDF(ticket.journeyDetails, ticket.date)}>
                Prikaži PDF kartu
              </button>
              <button className="btn btn-danger" onClick={() => handleDeleteTicket(ticket.id)}>
                Obriši kartu
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyTickets;
