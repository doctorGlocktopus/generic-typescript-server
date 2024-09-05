class CsvStringifier {
    private data: { [key: string]: any };
  
    constructor(data: any, requestedLines: string) {
      this.data = this.filterData(data, requestedLines);
    }
  
    private filterData(data: any, requestedLines: string): { [key: string]: any } {
      let filteredData: { [key: string]: any } = {};
      requestedLines.split(',').forEach(prop => {
        if (typeof data[prop] === 'object' && data[prop] !== null) {
          filteredData[prop] = '';
          Object.entries(data[prop]).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
              Object.entries(value).forEach(([nestedKey, nestedVal]) => {
                filteredData[prop] += `"${nestedKey}: ${nestedVal}" `;
              });
            } else {
              filteredData[prop] += `"${key}: ${value !== null ? value : 'leeres Feld'}" `;
            }
          });
        } else {
          if (data.hasOwnProperty(prop)) {
            filteredData[prop] = data[prop];
            if (typeof filteredData[prop] === 'boolean') {
              filteredData[prop] = filteredData[prop] ? 'ja' : 'nein';
            }
          }
        }
      });
      return filteredData;
    }
  
    public appendToStream(readableStream: NodeJS.WritableStream, header: string[]): void {
      try {
        const headerLine = header.join(',') + '\n';
        let dataLine = header.map(prop => {
          const value = this.data[prop];
          return value !== undefined ? value.toString().replace(/"/g, '""') : '';
        }).join(',') + '\n';
  
        // readableStream.write(headerLine);
        readableStream.write(dataLine);
      } catch (err) {
        console.error(err);
      }
    }
  }
  
  export default CsvStringifier;
  