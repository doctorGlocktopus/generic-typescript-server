import { Readable } from 'stream';

class CsvStringifier {
  private data: any[];
  private columns: string[];

  constructor(data: any[], columns: string[]) {
    this.data = data;
    this.columns = columns;
  }

  private escapeCsvValue(value: any): string {
    if (value == null) return '';
    if (typeof value === 'boolean') return value ? 'ja' : 'nein';
    const stringValue = value.toString().replace(/"/g, '""');
    return `"${stringValue}"`;
  }

  private generateCsvString(): string {
    const headerLine = this.columns.join(',') + '\n';
    const dataLines = this.data.map(row => 
      this.columns.map(col => this.escapeCsvValue(row[col])).join(',')
    ).join('\n');

    return headerLine + dataLines + '\n';
  }

  public getCsvStream(): Readable {
    const csvString = this.generateCsvString();
    const readableStream = new Readable();
    readableStream.push(csvString);
    readableStream.push(null); // End of stream
    return readableStream;
  }
}

export default CsvStringifier;
