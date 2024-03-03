import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AddStation from './AddStation';
import StationList from './StationList';
import AddRoute from './AddRoute';
import RouteList from './RouteList';
import AccountBalance from './AccountBalance';

function AdminDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container mt-5">
      {user && (
        <div>
          <h2 className="mb-4">Administratorska kontrolna tabla</h2>
          
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Dodaj stanicu</h5>
                  <AddStation />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Lista stanica</h5>
                  <StationList />
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Dodaj rutu</h5>
                  <AddRoute />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Lista ruta</h5>
                  <RouteList />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Ažuriranje stanja računa</h5>
                  <AccountBalance />
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
