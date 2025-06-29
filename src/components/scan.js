import { useState } from 'react';
import BarcodeScanner from "./BarcodeScanner";
import CryptoJS from 'crypto-js';


const ScanComponent = ({ secretKey }) => {
    const [error, setError] = useState('');
    const [decryptedText, setDecryptedText] = useState('');
    const [log, setLog] = useState([]);

    const decryptMessage = (ciphertext) => {
        try {
            const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        } catch {
            return null;
        }
    };

    const handleScan = (err, result) => {
        if (err || !result) return;

        const decrypted = decryptMessage(result.text);
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
        setError('');
    };

    return <div>
        <h1>Scan</h1>
        {
            !decryptedText ? (
                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ marginBottom: '10px' }}>Scan a QR Code:</h3>
                    <div style={{ width: '100%', maxWidth: '320px' }}>
                        <BarcodeScanner
                            width={320}
                            height={240}
                            onUpdate={handleScan}
                        />
                    </div>
                    {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                </div>
            ) : (
                <>
                    <div style={{ backgroundColor: '#e6ffe6', border: '1px solid #a6d8a6', padding: '12px' }}>
                        <h4>Decrypted Text:</h4>
                        <p>{decryptedText}</p>
                    </div>
                    <ul style={{
                        padding: 0,
                        listStyle: 'none',
                        display: 'flex',
                        gap: '20px'
                    }}>
                        <li><button type='button' onClick={() => {
                            setLog(prev => [...prev, decryptedText]);
                            setDecryptedText('');
                            setError('');
                        }}>Submit and Scan Next</button></li>
                    </ul>
                </>
            )
        }
        <ul>
            {
                log.map((l, i) => <li key={i}>{l}</li>)
            }
        </ul>

    </div>
}

export { ScanComponent }