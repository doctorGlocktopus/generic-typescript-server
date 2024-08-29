import React from 'react';

interface ApiResultsProps {
  data: any[];
}

const ApiResults: React.FC<ApiResultsProps> = ({ data }) => {
  return (
    <div>
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
                      ? JSON.stringify(value)
                      : value?.toString()
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

export default ApiResults;
