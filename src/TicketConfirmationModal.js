import React from 'react';
import Modal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.min.css'; 


function TicketConfirmationModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Potvrda rezervacije"
      className="modal-dialog modal-sm" 
    >
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Potvrda rezervacije</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          <p>Kupovina karte uspešna!</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>U redu</button>
        </div>
      </div>
    </Modal>
  );
}

export default TicketConfirmationModal;
