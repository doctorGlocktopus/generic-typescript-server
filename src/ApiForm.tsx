import React, { useState } from 'react';

interface ApiFormProps {
  setApiData: React.Dispatch<React.SetStateAction<any[]>>; // Typ für setApiData
  apiData: any[]; // Typ für apiData
  data: any[];    // Typ für data
}

const ApiForm: React.FC<ApiFormProps> = ({ setApiData, apiData, data }) => {
  const [url, setUrl] = useState('https://v2.jokeapi.dev/joke/Any?lang=de');
  const [apiKeys, setApiKeys] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);

  const fetchData = async () => {
    try {
      const headers: { [key: string]: string } = {};
      apiKeys.forEach(({ key, value }) => {
        if (key && value) headers[key] = value;
      });

      const response = await fetch(url, {
        method: 'GET',
        headers: headers as HeadersInit,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setApiData(Array.isArray(data) ? data : [data]); // Sicherstellen, dass es ein Array ist
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const addApiKey = () => {
    setApiKeys([...apiKeys, { key: '', value: '' }]);
  };

  const handleApiKeyChange = (index: number, field: string, value: string) => {
    const newKeys = [...apiKeys];
    newKeys[index] = { ...newKeys[index], [field]: value };
    setApiKeys(newKeys);
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

      {/* Tabelle mit Daten */}
      {Array.isArray(data) && data.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                {Object.entries(item).map(([key, value], index) => (
                  <td key={index}>
                    {typeof value === 'object' && value !== null
                      ? JSON.stringify(value) // Konvertiert das Objekt in einen lesbaren JSON-String
                      : value?.toString()      // Konvertiert den Wert in einen String
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApiForm;
