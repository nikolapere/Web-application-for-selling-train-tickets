import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

function RouteList() {
  const [routes, setRoutes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editTrainType, setEditTrainType] = useState("");

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const routeCollection = collection(db, "routes");
        const routeSnapshot = await getDocs(routeCollection);
        const routeData = routeSnapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        setRoutes(routeData);
      } catch (error) {
        console.error("Greška prilikom dobijanja ruta iz baze: ", error);
      }
    };

    fetchRoutes();
  }, []);

  const handleDeleteRoute = async (route) => {
    try {
      await deleteDoc(doc(db, "routes", route.id));
      setRoutes((prevRoutes) => prevRoutes.filter((r) => r.id !== route.id));
    } catch (error) {
      console.error("Greška prilikom brisanja rute: ", error);
    }
  };

  const handleEditRoute = (route) => {
    setCurrentRoute(route);
    setIsEditing(true);

    setEditStartTime(route.departureTime);
    setEditEndTime(route.arrivalTime);
    setEditTrainType(route.trainType);
  };

  const handleUpdateRoute = async () => {
    try {
      const routeRef = doc(db, "routes", currentRoute.id);
      const updatedRouteData = {
        startStation: currentRoute.startStation,
        endStation: currentRoute.endStation,
        price: currentRoute.price,
        departureTime: editStartTime,
        arrivalTime: editEndTime,
        trainType: editTrainType,
      };
      await updateDoc(routeRef, updatedRouteData);
      setRoutes((prevRoutes) =>
        prevRoutes.map((r) =>
          r.id === currentRoute.id ? { ...r, ...updatedRouteData } : r
        )
      );
      setCurrentRoute(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Greška prilikom ažuriranja rute: ", error);
    }
  };

  const handleCancelEdit = () => {
    setCurrentRoute(null);
    setIsEditing(false);
  };

  return (
    <div className="container mt-5">
      <ul className="list-group">
        {routes.map((route) => (
          <li key={route.id} className="list-group-item">
            {route.startStation} - {route.endStation} - Cena: {route.price}{" "}
            {isEditing && currentRoute && currentRoute.id === route.id ? (
              <div className="mt-2">
                <input
                  type="time"
                  className="form-control mb-2"
                  value={editStartTime}
                  onChange={(e) => setEditStartTime(e.target.value)}
                  placeholder="Vreme polaska"
                />
                <input
                  type="time"
                  className="form-control mb-2"
                  value={editEndTime}
                  onChange={(e) => setEditEndTime(e.target.value)}
                  placeholder="Vreme dolaska"
                />
                <select
                  className="form-select mb-2"
                  value={editTrainType}
                  onChange={(e) => setEditTrainType(e.target.value)}
                >
                  <option value="Brzi">Brzi</option>
                  <option value="Putnicki">Putnički</option>
                  <option value="Regionalni">Regionalni</option>
                </select>
              </div>
            ) : (
              <div>
                Vreme polaska: {route.departureTime}, Vreme dolaska: {route.arrivalTime},{" "}
                Vrsta voza: {route.trainType}
              </div>
            )}
            {isEditing && currentRoute && currentRoute.id === route.id ? (
              <div className="mt-2">
                <button className="btn btn-primary mr-2" onClick={handleUpdateRoute}>
                  Ažuriraj rutu
                </button>
                <button className="btn btn-secondary" onClick={handleCancelEdit}>
                  Otkaži uređivanje
                </button>
              </div>
            ) : (
              <div className="mt-2">
                <button className="btn btn-warning mr-2" onClick={() => handleEditRoute(route)}>
                  Uredi
                </button>
                <button className="btn btn-danger" onClick={() => handleDeleteRoute(route)}>
                  Obriši
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RouteList;
