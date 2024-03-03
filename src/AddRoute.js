import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

function AddRoute() {
  const [stations, setStations] = useState([]);
  const [selectedStartStation, setSelectedStartStation] = useState("");
  const [selectedEndStation, setSelectedEndStation] = useState("");
  const [price, setPrice] = useState("");
  const [selectedTrainType, setSelectedTrainType] = useState("Brzi");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const fetchStations = async () => {
      const stationCollection = collection(db, "stations");
      const stationSnapshot = await getDocs(stationCollection);
      const stationData = stationSnapshot.docs.map((doc) => doc.data());
      setStations(stationData);
    };

    fetchStations();
  }, []);

  const handleStartStationChange = (e) => {
    setSelectedStartStation(e.target.value);
  };

  const handleEndStationChange = (e) => {
    setSelectedEndStation(e.target.value);
  };

  const handleTrainTypeChange = (e) => {
    setSelectedTrainType(e.target.value);
  };

  const handleAddRoute = async () => {
    if (!selectedStartStation || !selectedEndStation || !price || !departureTime || !arrivalTime) {
      setFormError("Niste popunili sva polja.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "routes"), {
        startStation: selectedStartStation,
        endStation: selectedEndStation,
        price: price,
        trainType: selectedTrainType,
        departureTime: departureTime,
        arrivalTime: arrivalTime,
      });

      console.log(`Ruta uspešno dodata sa ID-em: ${docRef.id}`);

      // Reset input polja
      setSelectedStartStation("");
      setSelectedEndStation("");
      setPrice("");
      setSelectedTrainType("Brzi");
      setDepartureTime("");
      setArrivalTime("");
      setFormError(""); // Reset poruke o grešci
    } catch (error) {
      console.error("Greška prilikom dodavanja rute: ", error);
    }
  };

  return (
    <div className="container mt-5">
      {formError && <p style={{ color: "red" }}>{formError}</p>}
      <div className="mb-3">
        <label htmlFor="startStation" className="form-label">
          Polazna stanica:
        </label>
        <select
          id="startStation"
          className="form-select"
          value={selectedStartStation}
          onChange={handleStartStationChange}
          required
        >
          <option value="">Izaberite polaznu stanicu</option>
          {stations.map((station) => (
            <option key={station.name} value={station.name}>
              {station.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="endStation" className="form-label">
          Odredišna stanica:
        </label>
        <select
          id="endStation"
          className="form-select"
          value={selectedEndStation}
          onChange={handleEndStationChange}
          required
        >
          <option value="">Izaberite odredišnu stanicu</option>
          {stations.map((station) => (
            <option key={station.name} value={station.name}>
              {station.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="price" className="form-label">
          Cena rute:
        </label>
        <input
          type="text"
          id="price"
          className="form-control"
          placeholder="Unesite cenu"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="trainType" className="form-label">
          Tip voza:
        </label>
        <select
          id="trainType"
          className="form-select"
          value={selectedTrainType}
          onChange={handleTrainTypeChange}
          required
        >
          <option value="Brzi">Brzi voz</option>
          <option value="Putnicki">Putnički voz</option>
          <option value="Regionalni">Regionalni voz</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="departureTime" className="form-label">
          Vreme polaska:
        </label>
        <input
          type="time"
          id="departureTime"
          className="form-control"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="arrivalTime" className="form-label">
          Vreme dolaska:
        </label>
        <input
          type="time"
          id="arrivalTime"
          className="form-control"
          value={arrivalTime}
          onChange={(e) => setArrivalTime(e.target.value)}
          required
        />
      </div>
      <button className="btn btn-primary" onClick={handleAddRoute}>
        Dodaj rutu
      </button>
    </div>
  );
}

export default AddRoute;
