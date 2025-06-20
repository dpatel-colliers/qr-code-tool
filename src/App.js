import { useState } from "react";
import { CreateComponent } from "./components/create";
import { ScanComponent } from "./components/scan";

const SECRET_KEY = 'DATTU-TESTING-SECURE-KEY';

const App = () => {
  const [page, setPage] = useState(undefined);
  return <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
    <ul style={{
      padding: 0,
      listStyle: 'none',
      display: 'flex',
      gap: '20px'
    }}>
      {
        !page ?
          <>
            <li><button onClick={() => setPage('create')}>Create QR Code</button></li>
            <li><button onClick={() => setPage('scan')}>Scan QR Code</button></li>
          </> :
          <>
            <li><button onClick={() => setPage(undefined)}>Reset</button></li>
          </>
      }
    </ul>
    <div>
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
