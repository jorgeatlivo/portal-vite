import * as React from 'react';

export const IconPatientInBed = (props: { size: number; color: string }) => (
  <svg
    width={props.size || '100%'}
    height={props.size || '100%'}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g id="IconPatientInBed">
      <path
        id="Vector"
        d="M22 22V19M22 19H2M22 19H12V14H19C19.7956 14 20.5587 14.3161 21.1213 14.8787C21.6839 15.4413 22 16.2044 22 17V19ZM2 13V22M5 14C5 14.5304 5.21071 15.0391 5.58579 15.4142C5.96086 15.7893 6.46957 16 7 16C7.53043 16 8.03914 15.7893 8.41421 15.4142C8.78929 15.0391 9 14.5304 9 14C9 13.4696 8.78929 12.9609 8.41421 12.5858C8.03914 12.2107 7.53043 12 7 12C6.46957 12 5.96086 12.2107 5.58579 12.5858C5.21071 12.9609 5 13.4696 5 14Z"
        stroke={props.color || '#000'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        id="Vector_2"
        d="M10 5H14M12 3V7"
        stroke={props.color || '#000'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);
