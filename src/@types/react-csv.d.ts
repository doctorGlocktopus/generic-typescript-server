// src/@types/react-csv.d.ts
declare module 'react-csv' {
    import * as React from 'react';
  
    interface CSVLinkProps {
      data: any[];
      filename?: string;
      headers?: { label: string; key: string }[];
      asyncOnClick?: boolean;
      onClick?: () => void;
      className?: string;
      style?: React.CSSProperties;
    }
  
    export class CSVLink extends React.Component<CSVLinkProps> {}
  }
  