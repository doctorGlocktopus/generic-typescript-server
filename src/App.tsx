import React, { useState } from 'react';
import ApiForm from './ApiForm';
import ApiResults from './ApiResults';

function App() {
  const [apiData, setApiData] = useState<any[]>([]);

  return (
    <div className="App">
      <h1>API Dashboard</h1>
      {/* data wird jetzt korrekt an ApiForm übergeben */}
      <ApiForm setApiData={setApiData} apiData={apiData} data={apiData} />
      <ApiResults data={apiData} />
    </div>
  );
}

export default App;
