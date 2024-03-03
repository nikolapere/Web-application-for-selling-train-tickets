import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase'; 

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [messageSent, setMessageSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, 'contacts'), formData);
      console.log('Dokument uspešno dodat sa ID-em:', docRef.id);

      // Reset forme nakon slanja
      setFormData({
        name: '',
        email: '',
        message: '',
      });

      setMessageSent(true);

      // Reset obaveštenja nakon 5 sekundi
      setTimeout(() => {
        setMessageSent(false);
      }, 5000);
    } catch (error) {
      console.error('Greška prilikom dodavanja dokumenta:', error);
    }
  };

  return (
    <div className="mt-3">
      {messageSent && (
        <p className="alert alert-success">Poruka uspešno poslata, dobicete odgovor u najbržem mogućem roku.</p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">
          Ime:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="message">Poruka:</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Pošalji
      </button>
    </form>
  </div>
);
}

export default ContactForm;


