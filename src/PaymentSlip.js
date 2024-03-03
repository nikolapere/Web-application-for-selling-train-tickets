import React from 'react';
import './PaymentSlip.css';

function PaymentSlip(props) {
  const {
    uplatilac,
    svrhaUplate,
    primalac,
    sifraPlacanja,
    valuta,
    iznos,
    racunPrimaoca,
    brojModela,
    pozivNaBroj,
  } = props;

  return (
    <div className='instruction'>
      <h2>Nalog za uplatu</h2>
      <p>Uplatilac: <p className='payer'>{uplatilac}</p></p>
      <p>Svrha uplate: <p className='purpose'>{svrhaUplate}</p></p>
      <p>Primalac: <p className='payee'>{primalac}</p></p>
      <p className='code1'>Šifra plaćanja: <p className='code'>{sifraPlacanja}</p></p>
      <p className='currency1'>Valuta: <p className='currency'>{valuta}</p></p>
      <p className='amount1'>Iznos: <p className='amount'>{iznos}</p></p>
      <p className='payeeNumber1'>Račun primaoca: <p className='payeeNumber'>{racunPrimaoca}</p></p>
      <p className='model1'>Broj modela: <p className='model'>{brojModela}</p></p>
      <p className='referenceNumber1'>Poziv na broj (odobrenje): <p className='referenceNumber'>{pozivNaBroj}</p></p>
    </div>
  );
}

export default PaymentSlip;
