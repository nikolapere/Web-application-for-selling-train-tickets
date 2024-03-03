import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase'; 

function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [dob, setDob] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password) => {
    const lengthValid = password.length >= 8;
    const containsNumber = /[0-9]/.test(password);
    const containsUpperCase = /[A-Z]/.test(password);
    const containsLowerCase = /[a-z]/.test(password);
    const containsSpecialCharacter = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);
  
    return lengthValid && containsNumber && containsUpperCase && containsLowerCase && containsSpecialCharacter;
  };

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);

    if (!isEmailValid(newEmail)) {
      setEmailError('Unesite ispravnu e-mail adresu');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);

    if (!isPasswordValid(newPassword)) {
      setPasswordError('Lozinka mora da sadrži najmanje 8 karaktera, jedno veliko slovo i jedan specijalan karakter (!#$%^&).');
    } else {
      setPasswordError('');
    }
  };

  const handleImeChange = (event) => {
    const newIme = event.target.value;
    setIme(newIme);
  };

  const handlePrezimeChange = (event) => {
    const newPrezime = event.target.value;
    setPrezime(newPrezime);
  };

  const handleDobChange = (event) => {
    const newDob = event.target.value;
    setDob(newDob);
  };

  const handlePhoneNumberChange = (event) => {
    const newPhoneNumber = event.target.value;
    setPhoneNumber(newPhoneNumber);
  };

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Nakon registracije, korisnik je autentifikovan
      const user = userCredential.user;

      // Cuvanje podataka o korisniku u Firestore
      await addDoc(collection(db, 'users'), {
        email: user.email,
        ime: ime,
        prezime: prezime,
        dob: dob,
        phoneNumber: phoneNumber,
      });

      setRegistrationSuccess(true); // Uspeh na true nakon registracije
    } catch (error) {
      console.error('Greška prilikom registracije:', error);
    }
  }

  return (
    <div className="container mt-5">
      <h2>Registracija</h2>
      {registrationSuccess && <div className="alert alert-success">Uspešno ste se registrovali!</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">E-mail:</label>
          <input type="email" id="email" className="form-control" value={email} onChange={handleEmailChange} required />
          <div className="text-danger">{emailError}</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Lozinka:</label>
          <input type="password" id="password" className="form-control" value={password} onChange={handlePasswordChange} required />
          <div className="text-danger">{passwordError}</div>
        </div>
        <div className="mb-3">
          <label htmlFor="ime" className="form-label">Ime:</label>
          <input type="text" id="ime" className="form-control" value={ime} onChange={handleImeChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="prezime" className="form-label">Prezime:</label>
          <input type="text" id="prezime" className="form-control" value={prezime} onChange={handlePrezimeChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="dob" className="form-label">Datum rođenja:</label>
          <input type="date" id="dob" className="form-control" value={dob} onChange={handleDobChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">Broj telefona:</label>
          <input type="tel" id="phoneNumber" className="form-control" value={phoneNumber} onChange={handlePhoneNumberChange} required />
        </div>
        <button type="submit" className="btn btn-primary" disabled={emailError || passwordError}>Registruj se</button>
        <br></br>
        <br></br>
      </form>
    </div>
  );
}

export default RegistrationForm;
