import React, { useState, useEffect } from 'react';

interface ApiFormProps {
  setApiData: React.Dispatch<React.SetStateAction<any[]>>;
  apiData: any[];
  data: any[];
}

const ApiForm: React.FC<ApiFormProps> = ({ setApiData, apiData, data }) => {
  const [url, setUrl] = useState('https://v2.jokeapi.dev/joke/Any?lang=de');
  const [apiKeys, setApiKeys] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);
  const [allColumns, setAllColumns] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (data.length > 0) {

    }
  }, []);

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
      } catch (e) {
        throw new Error('Invalid JSON response');
      }
      setApiData(Array.isArray(fetchedData) ? fetchedData : [fetchedData]);


      const columns = Object.keys(fetchedData);
      const columnsObject = columns.reduce((acc, column) => {
        acc[column] = true;
        return acc;
      }, {} as Record<string, boolean>);

      setAllColumns(columnsObject);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching data', error);
      alert(`Error fetching data: ${errorMessage}`);
    }
  };

  const exportData = () => {
    fetch('http://localhost:3001/api/exportCsv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        columns: Object.keys(apiData[0]),
        data: apiData,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
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

    setAllColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
    setApiData(prevApiData => {
      if (prevApiData.length === 0) return prevApiData;
  
      const firstItem = prevApiData[0];
  
      const isKeyPresent = Object.keys(firstItem).includes(column) || 
                           (firstItem.flags && Object.keys(firstItem.flags).includes(column));
  
      if (isKeyPresent) {
        return prevApiData.map(item => {
          const newItem = { ...item };
          if (column in newItem) {
            delete newItem[column];
          } else if (newItem.flags && column in newItem.flags) {
            delete newItem.flags[column];
          }
          return newItem;
        });
      }

      return prevApiData;
    });
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

      {Object.keys(allColumns).length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <h3>Column Visibility</h3>
          {Object.entries(allColumns).map(([column, isVisible]) => (
            <div key={column}>
              <label>
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={() => toggleColumnVisibility(column)}
                />
                {column}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiForm;
