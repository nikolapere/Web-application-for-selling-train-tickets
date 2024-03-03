import React, { useState, useEffect } from 'react';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from './firebase';
import TicketConfirmationDialog from './TicketConfirmationDialog';

function StationAndDateSelection() {
  const [departureStations, setDepartureStations] = useState([]);
  const [arrivalStations, setArrivalStations] = useState([]);
  const [selectedDepartureStation, setSelectedDepartureStation] = useState('');
  const [selectedArrivalStation, setSelectedArrivalStation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');  // Dodatno polje za datum
  const [journeys, setJourneys] = useState([]);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showNoResultsMessage, setShowNoResultsMessage] = useState(false);

  useEffect(() => {
    async function fetchStations() {
      const stationsRef = collection(db, 'stations');
      const stationsSnapshot = await getDocs(stationsRef);
      const stationsData = stationsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setDepartureStations(stationsData);
      setArrivalStations(stationsData);
    }

    fetchStations();
  }, []);

  const handleSearch = async () => {
    if (selectedDate === '') {
      alert('Izaberite datum');
      return;
    }

    const journeysRef = collection(db, 'routes');
    const q = query(
      journeysRef,
      where('startStation', '==', selectedDepartureStation),
      where('endStation', '==', selectedArrivalStation),
    );
    const querySnapshot = await getDocs(q);
    const currentTime = new Date();  
    const journeyData = [];

    querySnapshot.forEach((doc) => {
      const journey = { id: doc.id, ...doc.data() };
      const journeyTime = new Date(`${selectedDate} ${journey.departureTime}`);
      
      if (journeyTime > currentTime) {
        journeyData.push(journey);
      }
    });

    setJourneys(journeyData);
    setShowNoResultsMessage(journeyData.length === 0);
  };

  const handleSelectJourney = () => {
    setShowConfirmationDialog(true);
  };

  const handleConfirm = () => {
    setShowConfirmationDialog(false);
  };

  const sortByDepartureTime = (a, b) => {
    const timeA = new Date(`${selectedDate} ${a.departureTime}`);
    const timeB = new Date(`${selectedDate} ${b.departureTime}`);
    return timeA - timeB;
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4 mb-3">
          <label htmlFor="departureStation" className="form-label">Stanica polaska:</label>
          <select
            className="form-select"
            name="departureStation"
            id="departureStation"
            value={selectedDepartureStation}
            onChange={(e) => setSelectedDepartureStation(e.target.value)}
          >
            <option value="">Izaberite stanicu za polazak</option>
            {departureStations.map((station) => (
              <option key={station.id} value={station.name}>
                {station.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4 mb-3">
          <label htmlFor="arrivalStation" className="form-label">Stanica dolaska:</label>
          <select
            className="form-select"
            name="arrivalStation"
            id="arrivalStation"
            value={selectedArrivalStation}
            onChange={(e) => setSelectedArrivalStation(e.target.value)}
          >
            <option value="">Izaberite stanicu za dolazak</option>
            {arrivalStations.map((station) => (
              <option key={station.id} value={station.name}>
                {station.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4 mb-3">
          <label htmlFor="date" className="form-label">Datum:</label>
          <input
            type="date"
            className="form-control"
            name="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          />
        </div>

        <div className="col-12 mb-3">
          <button className="btn btn-primary" onClick={handleSearch}>Pretraži</button>
        </div>

        {journeys.length > 0 ? (
          <div className="col-12">
            <h2>Rezultati pretrage:</h2>
            <ul className="list-group">
              {journeys.sort(sortByDepartureTime).map((journey) => (
                <li key={journey.id} className="list-group-item">
                  <div>Polazak: {journey.startStation} ({journey.departureTime})</div>
                  <div>Dolazak: {journey.endStation} ({journey.arrivalTime})</div>
                  <div>Tip voza: {journey.trainType}</div>
                  <div>Cena: {journey.price}</div>
                  <button className="btn btn-success" onClick={() => handleSelectJourney(journey)}>
                    Izaberi vožnju
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : showNoResultsMessage ? (
          <div className="col-12">
            <p>Nema raspoloživih vožnji za traženu relaciju.</p>
          </div>
        ) : null}
      </div>

      {showConfirmationDialog && (
        <TicketConfirmationDialog
          journey={journeys[0]}
          date={selectedDate}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}

export default StationAndDateSelection;
