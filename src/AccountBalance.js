import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

function AccountBalance() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState(0);
  const [users, setUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const usersData = [];
      usersSnapshot.forEach((userDoc) => {
        usersData.push({
          id: userDoc.id,
          ...userDoc.data(),
        });
      });
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(parseFloat(event.target.value));
  };

  const handleUpdateBalance = async () => {
    if (!selectedUser) {
      alert('Morate izabrati korisnika.');
      return;
    }

    const userRef = doc(db, 'users', selectedUser);
    await updateDoc(userRef, {
      accountBalance: amount,
    });

    setSuccessMessage('Stanje računa je uspešno ažurirano.');

    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="container mt-5">
      <label>Izaberite korisnika:</label>
      <select className="form-select mb-3" value={selectedUser} onChange={handleUserChange}>
        <option value={null}>Izaberite korisnika</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.email} - {user.dob} - {user.phoneNumber}
          </option>
        ))}
      </select>

      <label>Unesite iznos:</label>
      <input className="form-control mb-3" type="number" value={amount} onChange={handleAmountChange} />

      <button className="btn btn-primary" onClick={handleUpdateBalance}>
        Ažuriraj Stanje Računa
      </button>

      {successMessage && <p className="mt-3 text-success">{successMessage}</p>}
    </div>
  );
}

export default AccountBalance;
