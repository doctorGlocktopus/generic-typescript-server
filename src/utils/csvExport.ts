import Papa from 'papaparse';

export const exportToCSV = (data: any[]) => {
  const csv = Papa.unparse(data);  // Diese Methode sollte existieren
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'results.csv';
  link.click();
};
