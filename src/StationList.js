import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";

function StationList() {
  const [stations, setStations] = useState([]);
  const [editedStation, setEditedStation] = useState(null);

  useEffect(() => {
    const fetchStations = async () => {
      const stationCollection = collection(db, "stations");
      const stationSnapshot = await getDocs(stationCollection);
      const stationData = stationSnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() }; // Dodaje se ID stanice iz baze
      });
      setStations(stationData);
    };

    fetchStations();
  }, []);

  const handleEditStation = (station) => {
    // Otvara se dijalog za uređivanje stanice
    setEditedStation(station);
  };

  const handleSaveEdit = async () => {
    if (editedStation) {
      try {
        const stationRef = doc(db, "stations", editedStation.id);
        await updateDoc(stationRef, {
          name: editedStation.name,
          location: editedStation.location,
        });

        // Ažuriranje listu stanica nakon uređivanja
        const updatedStations = stations.map((station) =>
          station.id === editedStation.id ? editedStation : station
        );
        setStations(updatedStations);

        // Zatvaramo dijalog za uređivanje
        setEditedStation(null);
      } catch (error) {
        console.error("Greška prilikom ažuriranja stanice: ", error);
      }
    }
  };

  const handleDeleteStation = async (station) => {
    if (window.confirm("Da li ste sigurni da želite da obrišete ovu stanicu?")) {
      try {
        const stationRef = doc(db, "stations", station.id);
        await deleteDoc(stationRef);

        // Ažuriranje listu stanica nakon brisanja
        const updatedStations = stations.filter((s) => s.id !== station.id);
        setStations(updatedStations);
      } catch (error) {
        console.error("Greška prilikom brisanja stanice: ", error);
      }
    }
  };

  return (
    <div>
      <ul className="list-group">
        {stations.map((station) => (
          <li key={station.id} className="list-group-item d-flex justify-content-between align-items-center">
            {editedStation === station ? (
              <div>
                <input
                  type="text"
                  className="form-control"
                  value={editedStation.name}
                  onChange={(e) =>
                    setEditedStation({ ...editedStation, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="form-control mt-2"
                  value={editedStation.location}
                  onChange={(e) =>
                    setEditedStation({
                      ...editedStation,
                      location: e.target.value,
                    })
                  }
                />
                <button className="btn btn-success mt-2" onClick={handleSaveEdit}>
                  Sačuvaj
                </button>
              </div>
            ) : (
              <div>
                {station.name} - {station.location}
                <div>
                  <button className="btn btn-primary mx-2" onClick={() => handleEditStation(station)}>
                    Uredi
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDeleteStation(station)}>
                    Obriši
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StationList;
