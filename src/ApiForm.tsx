import React, { useState } from 'react';

interface ApiFormProps {
  setApiData: React.Dispatch<React.SetStateAction<any[]>>; // Typ für setApiData
  apiData: any[]; // Typ für apiData
  data: any[];    // Typ für data
}

const ApiForm: React.FC<ApiFormProps> = ({ setApiData, apiData, data }) => {
  const [url, setUrl] = useState('https://v2.jokeapi.dev/joke/Any?lang=de');
  const [apiKeys, setApiKeys] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => data.length > 0 ? Object.keys(data[0]) : []);

  const fetchData = async () => {
    try {
      const headers: Record<string, string> = {};
      apiKeys.forEach(({ key, value }) => {
        if (key && value) headers[key] = value;
      });
  
      const response = await fetch(url, { method: 'GET', headers });
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const textResponse = await response.text();
  
      let fetchedData;
      try {
        fetchedData = JSON.parse(textResponse);
        console.log(fetchedData);
      } catch (e) {
        throw new Error('Invalid JSON response');
      }
  
      setApiData(Array.isArray(fetchedData) ? fetchedData : [fetchedData]);
      if (Array.isArray(fetchedData) && fetchedData.length > 0) {
        setVisibleColumns(Object.keys(fetchedData[0]));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching data', error);
      alert(`Error fetching data: ${errorMessage}`);
    }
  };

  const exportData = () => {
    if (visibleColumns.length === 0) {
      alert('No columns selected for export.');
      return;
    }
  
    fetch('http://localhost:3001/api/exportCsv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        columns: visibleColumns, // Sichtbare Spalten
        data: apiData,           // Daten, die exportiert werden sollen
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('Error exporting data:', error);
      alert('Error exporting data');
    });
  };
  
  const addApiKey = () => {
    setApiKeys([...apiKeys, { key: '', value: '' }]);
  };

  const handleApiKeyChange = (index: number, field: string, value: string) => {
    const newKeys = [...apiKeys];
    newKeys[index] = { ...newKeys[index], [field]: value };
    setApiKeys(newKeys);
  };

  const toggleColumnVisibility = (column: string) => {
    setVisibleColumns(prev => 
      prev.includes(column) 
        ? prev.filter(c => c !== column) 
        : [...prev, column]
    );
  };

  return (
    <div>
      <input
        type="text"
        placeholder="API URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      {apiKeys.map((apiKey, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Key"
            value={apiKey.key}
            onChange={(e) => handleApiKeyChange(index, 'key', e.target.value)}
          />
          <input
            type="text"
            placeholder="Value"
            value={apiKey.value}
            onChange={(e) => handleApiKeyChange(index, 'value', e.target.value)}
          />
        </div>
      ))}
      <button onClick={addApiKey}>Add API Key</button>
      <button onClick={fetchData}>Fetch Data</button>
      <button onClick={exportData}>Export Data</button>

      {Array.isArray(data) && data.length > 0 && (
        <div>
          <h3>Column Visibility</h3>
          {Object.keys(data[0]).map(column => (
            <div key={column}>
              <label>
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(column)}
                  onChange={() => toggleColumnVisibility(column)}
                />
                {column}
              </label>
            </div>
          ))}

          <table>
            <thead>
              <tr>
                {visibleColumns.map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx}>
                  {visibleColumns.map((key, index) => (
                    <td key={index}>
                      {typeof item[key] === 'object' && item[key] !== null
                        ? JSON.stringify(item[key])
                        : item[key]?.toString()
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApiForm;
