// App.js
import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import CryptoJS from 'crypto-js';
import { Scanner } from '@yudiel/react-qr-scanner';

const SECRET_KEY = 'DATTU-TESTING-QR-CODE';

const encryptMessage = (text) => {
  const payload = {
    text,
    timestamp: new Date().toISOString(),
  };
  return CryptoJS.AES.encrypt(JSON.stringify(payload), SECRET_KEY).toString();
};

const decryptMessage = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch {
    return null;
  }
};

const App = () => {
  const [input, setInput] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!input.trim()) return setQrCode('');

    const encrypted = encryptMessage(input);
    QRCode.toDataURL(encrypted)
      .then(setQrCode)
      .catch(err => {
        console.error('QR generation failed:', err);
        setError('Failed to generate QR code');
      });
  }, [input]);

  const handleScan = (codes) => {
    if (scanned || codes.length === 0) return;

    const code = codes[0].rawValue;
    const decrypted = decryptMessage(code);

    if (!decrypted) {
      setError('Invalid or tampered QR code');
      return;
    }

    const ageMinutes = (Date.now() - new Date(decrypted.timestamp).getTime()) / 60000;
    if (ageMinutes > 720) {
      setError('QR code expired (older than 12 hours)');
      return;
    }

    setDecryptedText(decrypted.text);
    setScanned(true);
    setError('');

    setTimeout(() => setScanned(false), 3000);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>QR Text Encryptor & Scanner</h1>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="qr-input" style={{ display: 'block', marginBottom: '8px' }}>
          Enter text to encrypt into QR code:
        </label>
        <textarea
          id="qr-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          style={{ width: '100%', padding: '8px', fontSize: '16px' }}
          placeholder="Type your message here..."
        />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '10px' }}>Generated QR Code:</h3>
        {qrCode ? (
          <img src={qrCode} alt="QR Code" style={{ width: '200px', border: '1px solid #ccc', padding: '4px' }} />
        ) : (
          <p>No QR code generated.</p>
        )}
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '10px' }}>Scan a QR Code:</h3>
        <div style={{ width: '100%', maxWidth: '320px' }}>
          <Scanner
            onScan={handleScan}
            onError={(err) => setError(String(err))}
            constraints={{ facingMode: 'environment' }}
          />
        </div>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>

      {decryptedText && (
        <div style={{ backgroundColor: '#e6ffe6', border: '1px solid #a6d8a6', padding: '12px' }}>
          <h4>Decrypted Text:</h4>
          <p>{decryptedText}</p>
        </div>
      )}
    </div>
  );
};

export default App;
