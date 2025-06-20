import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import CryptoJS from 'crypto-js';


const CreateComponent = ({ secretKey }) => {
    const [input, setInput] = useState('');
    const [encryptedText, setEncryptedText] = useState('');

    const encryptMessage = (text) => {
        const payload = {
            text,
            timestamp: new Date().toISOString(),
        };
        return CryptoJS.AES.encrypt(JSON.stringify(payload), secretKey).toString();
    };
    const onSubmitHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!input.trim()) return setEncryptedText('');

        const encrypted = encryptMessage(input);
        setEncryptedText(encrypted);
    }
    return <div >
        <h1>Create QR Code</h1>
        <form onSubmit={onSubmitHandler}>
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
            <button type='submit'>Submit</button>
        </form>
        <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '10px' }}>Generated QR Code:</h3>
            {encryptedText ? (
                <QRCode value={encryptedText} size={200} style={{ border: '1px solid #ccc', padding: '4px' }} />
            ) : (
                <p>No QR code generated.</p>
            )}
        </div>
    </div>
}

export { CreateComponent }