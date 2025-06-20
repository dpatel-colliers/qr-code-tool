import { useState } from "react";
import { CreateComponent } from "./components/create";
import { ScanComponent } from "./components/scan";

const SECRET_KEY = 'DATTU-TESTING-SECURE-KEY';

const App = () => {
  const [page, setPage] = useState(undefined);
  return <div>
    <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Colliers - QR Text Encryptor & Scanner</h1>
    <ul>
      {
        !page ? <>
          <li><button onClick={() => setPage('create')}>Create QR Code</button></li>
          <li><button onClick={() => setPage('scan')}>Scan QR Code</button></li>
        </> :
          <>
            <li><button onClick={() => setPage(undefined)}>Reset</button></li>
          </>
      }


    </ul>
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      {
        page === 'create' &&
        <div>
          <CreateComponent secretKey={SECRET_KEY} />
        </div>
      }
      {
        page === 'scan' && <div>
          <ScanComponent secretKey={SECRET_KEY} />
        </div>
      }
    </div>

  </div>
};

export default App;
