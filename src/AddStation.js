import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

function AddStation() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const handleAddStation = async () => {
    try {
      const docRef = await addDoc(collection(db, "stations"), {
        name,
        location,
      });

      console.log(`Stanica uspešno dodata sa ID-em: ${docRef.id}`);

      // Reset input polja
      setName("");
      setLocation("");
    } catch (error) {
      console.error("Greška prilikom dodavanja stanice: ", error);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Naziv stanice"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Lokacija stanice"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleAddStation}>
          Dodaj
        </button>
      </div>
    </div>
  );
}

export default AddStation;
